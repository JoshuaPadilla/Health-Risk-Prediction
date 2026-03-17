"""
Local Survey Data Evaluation Script
Evaluates trained ML models (Logistic Regression, Random Forest, SVM) against
locally collected survey data and exports benchmark metrics to local_benchmarks.json.
"""

import json

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)

# ─── 1. Load Survey Dataset ───────────────────────────────────────────────────
print("Loading surveyed_data.csv...")
df = pd.read_csv("surveyed_data.csv")

# ─── 2. Feature Engineering ───────────────────────────────────────────────────

# Gender: Male=1, Female=0
df["Gender"] = df["Sex "].str.strip().map({"Male": 1, "Female": 0})

# Age
df["Age"] = pd.to_numeric(df["Age "].astype(str).str.strip(), errors="coerce")

# Sleep Duration (hours)
df["Sleep Duration"] = pd.to_numeric(
    df["On average, how many hours of sleep do you get per day? "]
    .astype(str)
    .str.strip(),
    errors="coerce",
)

# Quality of Sleep (1-10 scale)
df["Quality of Sleep"] = pd.to_numeric(
    df["How would you rate the QUALITY of your sleep? "], errors="coerce"
)

# Physical Activity Level (minutes/day)
df["Physical Activity Level"] = pd.to_numeric(
    df["How many minutes of physical activity do you do per day? "], errors="coerce"
)

# Stress Level (1-10 scale)
df["Stress Level"] = pd.to_numeric(
    df["How often do you feel stressed? (Stress Level) "], errors="coerce"
)

# Heart Rate (BPM)
df["Heart Rate"] = pd.to_numeric(
    df["What is your Resting Heart Rate? (BPM) "].astype(str).str.strip(),
    errors="coerce",
)

# Daily Steps: map categorical ranges to representative integer midpoints
steps_map = {
    "Less than 3,000 (Sedentary)": 2000,
    "3,000 - 5,000 (Light Activity)": 4000,
    "5,000 - 8,000 (Moderate Activity)": 6500,
    "8,000 - 10,000 (Active)": 9000,
    "More than 10,000 (Very Active)": 11000,
}
df["Daily Steps"] = df["Estimate your Daily Steps "].map(steps_map)

# Blood Pressure: parse "SystolicBP/DiastolicBP" strings; non-standard values → NaN
def parse_bp(value):
    val = str(value).strip()
    if "/" in val:
        parts = val.split("/")
        try:
            return float(parts[0].strip()), float(parts[1].strip())
        except ValueError:
            return np.nan, np.nan
    return np.nan, np.nan


bp_series = df["Blood Pressure"].apply(parse_bp)
df["SystolicBP"] = bp_series.apply(lambda x: x[0])
df["DiastolicBP"] = bp_series.apply(lambda x: x[1])

# BMI Category: compute from height (cm) and weight (kg), then encode
# 0 = Normal (includes Underweight for simplicity), 1 = Overweight, 2 = Obese
height_m = (
    pd.to_numeric(df["Height  (in cm)  "].astype(str).str.strip(), errors="coerce")
    / 100
)
weight_kg = pd.to_numeric(
    df["Weight (in kg)  Example: 65 "].astype(str).str.strip(), errors="coerce"
)
bmi = weight_kg / (height_m**2)


def bmi_to_category(b):
    if pd.isna(b):
        return np.nan
    if b < 25.0:
        return 0  # Normal / Underweight
    elif b < 30.0:
        return 1  # Overweight
    else:
        return 2  # Obese


df["BMI Category"] = bmi.apply(bmi_to_category)

# ─── 3. Separate Feature Columns from Target Variable ────────────────────────
feature_cols = [
    "Gender",
    "Age",
    "Sleep Duration",
    "Quality of Sleep",
    "Physical Activity Level",
    "Stress Level",
    "BMI Category",
    "Heart Rate",
    "Daily Steps",
    "SystolicBP",
    "DiastolicBP",
]

X = df[feature_cols].copy()

# Impute any remaining NaN values with the column median
# (handles rows with invalid blood pressure, missing entries, etc.)
for col in feature_cols:
    X[col] = X[col].fillna(X[col].median())

# Derive the Risk Label (target variable) using clinically grounded thresholds.
# A respondent is considered High Risk (1) if they exhibit at least 2 of the
# following sleep-disorder risk indicators; otherwise Low Risk (0):
#   - High stress level   (>= 7)
#   - Short sleep duration (< 6 hours)
#   - Poor sleep quality  (<= 3)
#   - Obese BMI           (category == 2)
#   - Elevated BP         (systolic >= 130 OR diastolic >= 85)
def derive_risk_label(row):
    indicators = 0
    if row["Stress Level"] >= 7:
        indicators += 1
    if row["Sleep Duration"] < 6:
        indicators += 1
    if row["Quality of Sleep"] <= 3:
        indicators += 1
    if row["BMI Category"] == 2:
        indicators += 1
    if row["SystolicBP"] >= 130 or row["DiastolicBP"] >= 85:
        indicators += 1
    return 1 if indicators >= 2 else 0


y = X.apply(derive_risk_label, axis=1)
print(f"Target distribution — Low Risk (0): {(y == 0).sum()}, High Risk (1): {(y == 1).sum()}")

# ─── 4. Load and Apply Scaler ─────────────────────────────────────────────────
print("Loading scaler.pkl...")
scaler = joblib.load("scaler.pkl")
X_scaled = scaler.transform(X)

# ─── 5. Load Models ───────────────────────────────────────────────────────────
print("Loading models...")
lr_model = joblib.load("logistic_regression_model.pkl")
rf_model = joblib.load("random_forest_model.pkl")
svm_model = joblib.load("svm_model.pkl")

# ─── 6. Generate Predictions ──────────────────────────────────────────────────
predictions = {
    "Logistic Regression": lr_model.predict(X_scaled),
    "Random Forest": rf_model.predict(X_scaled),
    "SVM": svm_model.predict(X_scaled),
}

# ─── 7. Evaluate Models ───────────────────────────────────────────────────────
benchmark_data = []

print("\n--- Evaluation Results ---")
for name, y_pred in predictions.items():
    accuracy = accuracy_score(y, y_pred)
    precision = precision_score(y, y_pred, average="weighted", zero_division=0)
    recall = recall_score(y, y_pred, average="weighted", zero_division=0)
    f1 = f1_score(y, y_pred, average="weighted", zero_division=0)
    cm = confusion_matrix(y, y_pred)

    print(
        f"{name}: Accuracy={accuracy * 100:.1f}%  "
        f"Precision={precision * 100:.1f}%  "
        f"Recall={recall * 100:.1f}%  "
        f"F1={f1 * 100:.1f}%"
    )
    print(f"  Confusion Matrix:\n{cm}\n")

    benchmark_data.append(
        {
            "algorithm": name,
            "accuracy": round(accuracy * 100, 1),
            "precision": round(precision * 100, 1),
            "recall": round(recall * 100, 1),
            "f1_score": round(f1 * 100, 1),
            "status": "Ready",
            "confusion_matrix": cm.tolist(),
        }
    )

# ─── 8. Export to JSON ────────────────────────────────────────────────────────
with open("local_benchmarks.json", "w") as f:
    json.dump(benchmark_data, f, indent=4)

print("Benchmark data saved to 'local_benchmarks.json'")
