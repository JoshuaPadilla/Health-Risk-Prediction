from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

# Initialize the App (Like 'const app = express()')
app = FastAPI()

# --- 1. Load Your "Brains" ---
# We load all 3 models + the Scaler into memory when the server starts.
# Ensure these filenames match EXACTLY what your training script saved.
models = {
    "logistic": joblib.load("logistic_regression_model.pkl"),
    "svm": joblib.load("svm_model.pkl"),
    "forest": joblib.load("random_forest_model.pkl"),
}
scaler = joblib.load("scaler.pkl")


# --- 2. Define the DTO (Data Transfer Object) ---
# This ensures the frontend sends the correct data types.
class StudentHealthData(BaseModel):
    gender: int  # 0=Female, 1=Male
    age: int
    sleep_duration: float
    quality_of_sleep: int  # Scale 1-10
    physical_activity: int  # Minutes per day
    stress_level: int  # Scale 1-10
    bmi_category: int  # 0=Normal, 1=Overweight, 2=Obese
    heart_rate: int
    daily_steps: int
    systolic_bp: int  # Top number (e.g., 120)
    diastolic_bp: int  # Bottom number (e.g., 80)


# --- 3. The API Endpoint ---
@app.post("/predict/{model_name}")
def predict_health_risk(model_name: str, data: StudentHealthData):
    print(data)
    # A. Select the Model
    if model_name not in models:
        raise HTTPException(
            status_code=404,
            detail="Model not found. Use 'logistic', 'svm', or 'forest'",
        )

    selected_model = models[model_name]

    # B. Convert DTO to DataFrame (The format the model expects)
    # IMPORTANT: The column order MUST match your training data exactly.
    input_data = pd.DataFrame(
        [
            [
                data.gender,
                data.age,
                data.sleep_duration,
                data.quality_of_sleep,
                data.physical_activity,
                data.stress_level,
                data.bmi_category,
                data.heart_rate,
                data.daily_steps,
                data.systolic_bp,
                data.diastolic_bp,
            ]
        ],
        columns=[
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
        ],
    )

    # C. Scale the Data (Crucial Step!)
    # We must apply the same math (Z-score) used during training.
    scaled_data = scaler.transform(input_data)
    print(input_data)
    # D. Predict
    prediction = selected_model.predict(scaled_data)  # Returns [0] or [1]
    probability = selected_model.predict_proba(scaled_data)[0][
        1
    ]  # Returns % chance of being High Risk

    # E. Return JSON
    return {
        "model_used": model_name,
        "risk_prediction": int(prediction[0]),  # 0 = Low, 1 = High
        "risk_probability": round(probability * 100, 2),  # e.g., 85.5%
        "status": "High Risk" if prediction[0] == 1 else "Low Risk",
    }


# python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
