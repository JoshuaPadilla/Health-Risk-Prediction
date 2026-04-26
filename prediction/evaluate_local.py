"""
Local survey evaluation script.

This script cleans the updated surveyed data, exports a model-ready snapshot,
summarizes the cleaning decisions, and reevaluates the trained models against
the cleaned local dataset.
"""

import json
import re
from pathlib import Path

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

BASE_DIR = Path(__file__).resolve().parent
RAW_DATASET_PATH = BASE_DIR / "surveyed_data.csv"
CLEANED_DATASET_PATH = BASE_DIR / "surveyed_data_cleaned.csv"
CLEANING_SUMMARY_PATH = BASE_DIR / "surveyed_data_cleaning_summary.json"
BENCHMARKS_PATH = BASE_DIR / "local_benchmarks.json"
SCALER_PATH = BASE_DIR / "scaler.pkl"
MODEL_PATHS = {
    "Logistic Regression": BASE_DIR / "logistic_regression_model.pkl",
    "Random Forest": BASE_DIR / "random_forest_model.pkl",
    "SVM": BASE_DIR / "svm_model.pkl",
}

FEATURE_COLUMNS = [
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


def normalize_label(value: object) -> str:
    return " ".join(str(value).split()).casefold()


def clean_text(value: object) -> str:
    if pd.isna(value):
        return ""
    return " ".join(str(value).strip().split())


def normalize_numeric_text(value: object) -> str:
    return (
        clean_text(value)
        .replace(",", "")
        .replace("$0", "0")
        .replace("1o", "10")
        .replace("O", "0")
        .replace("o", "0")
    )


def parse_numeric(value: object) -> float:
    text = normalize_numeric_text(value)
    if not text:
        return np.nan
    try:
        return float(text)
    except ValueError:
        return np.nan


def resolve_column_name(df: pd.DataFrame, *aliases: str) -> str:
    column_lookup = {normalize_label(column): column for column in df.columns}
    for alias in aliases:
        resolved_column = column_lookup.get(normalize_label(alias))
        if resolved_column:
            return resolved_column
    raise KeyError(
        "None of the expected columns were found in surveyed_data.csv: "
        + ", ".join(aliases)
    )


def parse_gender(value: object) -> float:
    mapping = {
        "male": 1,
        "m": 1,
        "1": 1,
        "female": 0,
        "f": 0,
        "0": 0,
    }
    return mapping.get(normalize_label(value), np.nan)


def parse_minutes(value: object) -> float:
    text = normalize_label(value)
    if not text:
        return np.nan

    compact = (
        text.replace("$0", "0")
        .replace("1o", "10")
        .replace("hours", "hr")
        .replace("hour", "hr")
        .replace("hrs", "hr")
        .replace("mins", "min")
        .replace(" ", "")
    )

    match = re.fullmatch(r"(?P<hours>\d+(?:\.\d+)?)hr(?P<minutes>\d+(?:\.\d+)?)min", compact)
    if match:
        return float(match.group("hours")) * 60 + float(match.group("minutes"))

    match = re.fullmatch(r"(?P<num>\d+(?:\.\d+)?)hr", compact)
    if match:
        return float(match.group("num")) * 60

    match = re.fullmatch(r"(?P<num>\d+(?:\.\d+)?)min", compact)
    if match:
        return float(match.group("num"))

    return parse_numeric(compact)


def parse_daily_steps(value: object) -> float:
    normalized_value = normalize_label(value).replace(",", "")
    step_ranges = {
        "less than 3000 (sedentary)": 2000,
        "sedentary": 2000,
        "3000 - 5000 (light activity)": 4000,
        "3000-5000 (light activity)": 4000,
        "3000 - 5000": 4000,
        "3000-5000": 4000,
        "light activity": 4000,
        "lihgt activity": 4000,
        "5000 - 8000 (moderate activity)": 6500,
        "5000-8000 (moderate activity)": 6500,
        "5000 - 8000": 6500,
        "5000-8000": 6500,
        "moderate activity": 6500,
        "8000 - 10000 (active)": 9000,
        "8000-10000 (active)": 9000,
        "8000 - 10000": 9000,
        "8000-10000": 9000,
        "active": 9000,
        "more than 10000 (very active)": 11000,
        "very active": 11000,
    }
    if normalized_value in step_ranges:
        return step_ranges[normalized_value]
    return parse_numeric(normalized_value)


def parse_blood_pressure(value: object) -> tuple[float, float]:
    text = clean_text(value)
    if not text:
        return np.nan, np.nan

    systolic = np.nan
    diastolic = np.nan

    if "/" in text:
        try:
            left, right = text.split("/", 1)
            systolic = float(left.strip())
            diastolic = float(right.strip())
        except ValueError:
            return np.nan, np.nan
    else:
        digits = re.sub(r"\D", "", text)
        if len(digits) == 5:
            systolic = float(digits[:3])
            diastolic = float(digits[3:])
        elif len(digits) == 4:
            systolic = float(digits[:2])
            diastolic = float(digits[2:])

    if 70 <= systolic <= 250 and 40 <= diastolic <= 150:
        return systolic, diastolic
    return np.nan, np.nan


def parse_height_cm(value: object) -> float:
    number = parse_numeric(value)
    if pd.isna(number):
        return np.nan
    if 100 <= number <= 250:
        return number

    if float(number).is_integer():
        integer_value = int(number)
        if 40 <= integer_value < 100:
            feet = integer_value // 10
            inches = integer_value % 10
            if 0 <= inches < 12:
                return (feet * 12 + inches) * 2.54

    if 4 <= number < 8:
        feet = int(number)
        inches = round((number - feet) * 10)
        if 0 <= inches < 12:
            return (feet * 12 + inches) * 2.54
        return number * 30.48

    return np.nan


def parse_weight_kg(value: object) -> float:
    number = parse_numeric(value)
    if pd.isna(number):
        return np.nan
    if 20 <= number <= 300:
        return number
    if 2 <= number < 10:
        return number * 10
    return np.nan


def parse_age(value: object) -> float:
    number = parse_numeric(value)
    if pd.isna(number):
        return np.nan
    if 10 <= number <= 100:
        return number
    if number > 100 and number % 10 == 0:
        repaired = number / 10
        if 10 <= repaired <= 100:
            return repaired
    return np.nan


def parse_sleep_duration(value: object) -> float:
    text = clean_text(value)
    if not text:
        return np.nan

    match = re.fullmatch(r"(\d+(?:\.\d+)?)\s*[-/]\s*(\d+(?:\.\d+)?)", text)
    if match:
        return (float(match.group(1)) + float(match.group(2))) / 2

    number = parse_numeric(text)
    if pd.isna(number):
        return np.nan
    if 0 <= number <= 24:
        return number
    if 30 <= number <= 99:
        repaired = number / 10
        if repaired <= 24:
            return repaired
    return np.nan


def parse_scale_1_to_10(value: object) -> float:
    number = parse_numeric(value)
    if pd.isna(number):
        return np.nan
    if number == 0:
        return 1.0
    if 1 <= number <= 10:
        return number
    return np.nan


def parse_heart_rate(value: object) -> float:
    number = parse_numeric(value)
    if pd.isna(number):
        return np.nan
    if 30 <= number <= 220:
        return number
    return np.nan


def bmi_to_category(value: float) -> float:
    if pd.isna(value):
        return np.nan
    if value < 25:
        return 0
    if value < 30:
        return 1
    return 2


def derive_risk_label(row: pd.Series) -> int:
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


def build_clean_frames(raw_df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    deduped_df = raw_df.drop_duplicates().reset_index(drop=True)

    sex_col = resolve_column_name(deduped_df, "Sex", "Gender")
    age_col = resolve_column_name(deduped_df, "Age")
    sleep_duration_col = resolve_column_name(
        deduped_df, "On average, how many hours of sleep do you get per day?"
    )
    quality_of_sleep_col = resolve_column_name(
        deduped_df, "How would you rate the QUALITY of your sleep?"
    )
    physical_activity_col = resolve_column_name(
        deduped_df, "How many minutes of physical activity do you do per day?"
    )
    stress_level_col = resolve_column_name(
        deduped_df, "How often do you feel stressed? (Stress Level)"
    )
    heart_rate_col = resolve_column_name(
        deduped_df, "What is your Resting Heart Rate? (BPM)"
    )
    daily_steps_col = resolve_column_name(deduped_df, "Estimate your Daily Steps")
    blood_pressure_col = resolve_column_name(deduped_df, "Blood Pressure")
    height_col = resolve_column_name(deduped_df, "Height (in cm)")
    weight_col = resolve_column_name(
        deduped_df, "Weight (in kg)", "Weight (in kg) Example: 65"
    )

    feature_frame = pd.DataFrame(index=deduped_df.index)
    feature_frame["Gender"] = deduped_df[sex_col].apply(parse_gender)
    feature_frame["Age"] = deduped_df[age_col].apply(parse_age)
    feature_frame["Sleep Duration"] = deduped_df[sleep_duration_col].apply(
        parse_sleep_duration
    )
    feature_frame["Quality of Sleep"] = deduped_df[quality_of_sleep_col].apply(
        parse_scale_1_to_10
    )
    feature_frame["Physical Activity Level"] = deduped_df[
        physical_activity_col
    ].apply(parse_minutes)
    feature_frame["Stress Level"] = deduped_df[stress_level_col].apply(
        parse_scale_1_to_10
    )

    height_cm = deduped_df[height_col].apply(parse_height_cm)
    weight_kg = deduped_df[weight_col].apply(parse_weight_kg)
    height_m = height_cm / 100
    bmi = weight_kg / (height_m**2)

    feature_frame["BMI Category"] = bmi.apply(bmi_to_category)
    feature_frame["Heart Rate"] = deduped_df[heart_rate_col].apply(parse_heart_rate)
    feature_frame["Daily Steps"] = deduped_df[daily_steps_col].apply(parse_daily_steps)

    blood_pressure = deduped_df[blood_pressure_col].apply(parse_blood_pressure)
    feature_frame["SystolicBP"] = blood_pressure.apply(lambda pair: pair[0])
    feature_frame["DiastolicBP"] = blood_pressure.apply(lambda pair: pair[1])

    cleaned_snapshot = pd.DataFrame(
        {
            "Gender": feature_frame["Gender"],
            "Age": feature_frame["Age"],
            "Height (cm)": height_cm,
            "Weight (kg)": weight_kg,
            "BMI": bmi,
            "BMI Category": feature_frame["BMI Category"],
            "Sleep Duration": feature_frame["Sleep Duration"],
            "Quality of Sleep": feature_frame["Quality of Sleep"],
            "Physical Activity Level": feature_frame["Physical Activity Level"],
            "Stress Level": feature_frame["Stress Level"],
            "Heart Rate": feature_frame["Heart Rate"],
            "Daily Steps": feature_frame["Daily Steps"],
            "SystolicBP": feature_frame["SystolicBP"],
            "DiastolicBP": feature_frame["DiastolicBP"],
        }
    )

    return deduped_df, feature_frame[FEATURE_COLUMNS], cleaned_snapshot


print("Loading surveyed_data.csv...")
raw_df = pd.read_csv(RAW_DATASET_PATH)
deduped_df, feature_frame, cleaned_snapshot = build_clean_frames(raw_df)

feature_missing_counts = {
    column: int(count)
    for column, count in feature_frame.isna().sum().to_dict().items()
}
complete_mask = ~feature_frame.isna().any(axis=1)
X = feature_frame.loc[complete_mask].copy()
cleaned_snapshot = cleaned_snapshot.loc[complete_mask].copy()

if X.empty:
    raise ValueError("No complete local survey rows were available after cleaning.")

y = X.apply(derive_risk_label, axis=1)
cleaned_snapshot["Risk Label"] = y.to_numpy(dtype=int)
cleaned_snapshot = cleaned_snapshot.round(
    {
        "Age": 0,
        "Height (cm)": 1,
        "Weight (kg)": 1,
        "BMI": 2,
        "BMI Category": 0,
        "Sleep Duration": 2,
        "Quality of Sleep": 0,
        "Physical Activity Level": 1,
        "Stress Level": 0,
        "Heart Rate": 0,
        "Daily Steps": 0,
        "SystolicBP": 0,
        "DiastolicBP": 0,
        "Risk Label": 0,
    }
)
cleaned_snapshot.to_csv(CLEANED_DATASET_PATH, index=False)

cleaning_summary = {
    "raw_rows": int(len(raw_df)),
    "duplicate_rows_removed": int(len(raw_df) - len(deduped_df)),
    "rows_after_deduplication": int(len(deduped_df)),
    "feature_missing_counts_before_drop": feature_missing_counts,
    "rows_dropped_after_cleaning": int((~complete_mask).sum()),
    "rows_kept_for_evaluation": int(len(X)),
    "target_distribution": {
        "low_risk": int((y == 0).sum()),
        "high_risk": int((y == 1).sum()),
    },
}

with CLEANING_SUMMARY_PATH.open("w", encoding="utf-8") as handle:
    json.dump(cleaning_summary, handle, indent=4)

print(
    "Cleaning summary:",
    {
        "rows_after_deduplication": cleaning_summary["rows_after_deduplication"],
        "rows_kept_for_evaluation": cleaning_summary["rows_kept_for_evaluation"],
        "rows_dropped_after_cleaning": cleaning_summary["rows_dropped_after_cleaning"],
    },
)
print(
    "Target distribution — Low Risk (0): "
    f"{cleaning_summary['target_distribution']['low_risk']}, "
    f"High Risk (1): {cleaning_summary['target_distribution']['high_risk']}"
)

print("Loading scaler.pkl...")
scaler = joblib.load(SCALER_PATH)
X_scaled = scaler.transform(X)

print("Loading models...")
models = {name: joblib.load(path) for name, path in MODEL_PATHS.items()}

benchmark_data = []

print("\n--- Evaluation Results ---")
for name, model in models.items():
    y_pred = model.predict(X_scaled)
    accuracy = accuracy_score(y, y_pred)
    precision = precision_score(y, y_pred, average="weighted", zero_division=0)
    recall = recall_score(y, y_pred, average="weighted", zero_division=0)
    f1 = f1_score(y, y_pred, average="weighted", zero_division=0)
    cm = confusion_matrix(y, y_pred, labels=[0, 1])

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

with BENCHMARKS_PATH.open("w", encoding="utf-8") as handle:
    json.dump(benchmark_data, handle, indent=4)

print(f"Cleaned survey data saved to '{CLEANED_DATASET_PATH.name}'")
print(f"Cleaning summary saved to '{CLEANING_SUMMARY_PATH.name}'")
print(f"Benchmark data saved to '{BENCHMARKS_PATH.name}'")
