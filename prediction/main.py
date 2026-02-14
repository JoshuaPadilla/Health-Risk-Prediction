from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

# Initialize the App (Like 'const app = express()')
app = FastAPI(root_path="/api/fast")


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

    # D. Predict
    prediction = selected_model.predict(scaled_data)  # Returns [0] or [1]
    probability = selected_model.predict_proba(scaled_data)[0][
        1
    ]  # Returns % chance of being High Risk

    recommendations = generate_detailed_feedback(data)
    riskRecommendaction = generate_main_card(prediction[0], probability)

    # E. Return JSON
    return {
        "model_used": model_name,
        "risk_prediction": int(prediction[0]),  # 0 = Low, 1 = High
        "risk_probability": round(probability * 100, 2),  # e.g., 85.5%
        "status": "High Risk" if prediction[0] == 1 else "Low Risk",
        "recommendations": recommendations,
        "riskRecommendation": riskRecommendaction
    }

def generate_detailed_feedback(data):
    feedback = []

    # --- 1. SLEEP (The most critical factor for students) ---
    if data.sleep_duration < 6:
        feedback.append({
            "category": "Sleep Health",
            "status": "danger",  # Red
            "title": "Severe Sleep Deprivation",
            "message": "You are getting less than 6 hours of sleep. This severely impacts memory and focus. Aim for at least 7 hours.",
            "color": "red"
        })
    elif 6 <= data.sleep_duration < 7:
        feedback.append({
            "category": "Sleep Health",
            "status": "warning", # Yellow
            "title": "Minor Sleep Debt",
            "message": "6 hours is survival mode, not growth mode. Try going to bed 30 minutes earlier.",
            "color": "yellow"
        })
    else:
        feedback.append({
            "category": "Sleep Health",
            "status": "success", # Green
            "title": "Optimal Sleep",
            "message": "Great job! You are getting enough rest to maximize your academic performance.",
            "color": "green"
        })

    # --- 2. STRESS (Mental Health) ---
    if data.stress_level >= 7:
        feedback.append({
            "category": "Mental Wellness",
            "status": "danger",
            "title": "High Stress Levels",
            "message": "Your reported stress is concerning. Please consider visiting the Guidance Office or taking a break.",
            "color": "red"
        })
    elif 4 <= data.stress_level < 7:
        feedback.append({
            "category": "Mental Wellness",
            "status": "warning",
            "title": "Moderate Stress",
            "message": "You are under pressure. Try simple breathing exercises or a short walk to reset.",
            "color": "yellow"
        })
    else:
        feedback.append({
            "category": "Mental Wellness",
            "status": "success",
            "title": "Low Stress",
            "message": "You are managing pressure well! This is key for long-term success.",
            "color": "green"
        })

    # --- 3. BMI / WEIGHT (Physical Status) ---
    # Logic: 0=Underweight, 1=Normal, 2=Overweight, 3=Obese
    if data.bmi_category == 0:
        feedback.append({
            "category": "Physical Health",
            "status": "warning",
            "title": "Underweight Risk",
            "message": "Your BMI is lower than optimal. Ensure you are eating enough nutrient-dense meals.",
            "color": "yellow"
        })
    elif data.bmi_category == 2:
        feedback.append({
            "category": "Physical Health",
            "status": "warning",
            "title": "Weight Management",
            "message": "You are slightly above the ideal range. Small diet changes can help restore balance.",
            "color": "yellow"
        })
    elif data.bmi_category == 3:
        feedback.append({
            "category": "Physical Health",
            "status": "danger",
            "title": "Obesity Risk",
            "message": "Your BMI indicates a risk for metabolic issues. Consider a consultation at the clinic.",
            "color": "red"
        })
    else: # Normal
        feedback.append({
            "category": "Physical Health",
            "status": "success",
            "title": "Healthy Weight",
            "message": "Your BMI is within the normal range. Maintain your current diet and activity!",
            "color": "green"
        })

    # --- 4. PHYSICAL ACTIVITY (Lifestyle) ---
    if data.physical_activity < 30:
        feedback.append({
            "category": "Lifestyle",
            "status": "danger",
            "title": "Sedentary Lifestyle",
            "message": "Less than 30 mins of movement weakens your heart. Try walking to class instead of riding.",
            "color": "red"
        })
    else:
        feedback.append({
            "category": "Lifestyle",
            "status": "success",
            "title": "Active Living",
            "message": "Excellent! Regular movement is protecting you from future heart risks.",
            "color": "green"
        })

    return feedback

def generate_main_card(prediction, probability):
    # Convert "Risk Probability" to "Health Score"
    # If probability of risk is 0.2 (20%), Health Score is 80.
    health_score = round((1 - probability) * 100)

    if prediction == 0: # LOW RISK (Healthy)
        return {
            "title": "Risk Level: LOW",
            "status": "success", # Green
            "score": health_score,
            "message": "Great job! Your health metrics indicate you are currently at low risk. Your vitals and lifestyle habits are well within the optimal range.",
            "icon": "shield-check"
        }
    else: # HIGH RISK (Unhealthy)
        return {
            "title": "Risk Level: HIGH",
            "status": "danger", # Red
            "score": health_score,
            "message": "Attention Needed. Your metrics indicate a higher likelihood of potential health risks. We recommend consulting with the university clinic.",
            "icon": "alert-triangle"
        }

# python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
