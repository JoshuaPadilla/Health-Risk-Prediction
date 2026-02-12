import type { PredictionForm } from "@/types/prediction_form";

export const validatePredictionForm = (
	data: PredictionForm,
): { success: boolean; errors: string[] } => {
	const errors: string[] = [];

	// Step 1: Identity
	if (data.age <= 0) errors.push("Please enter a valid Age.");
	if (data.height <= 0) errors.push("Please enter a valid Height.");
	if (data.weight <= 0) errors.push("Please enter a valid Weight.");

	// Step 2: Lifestyle
	if (data.sleep_duration <= 0) {
		errors.push("Sleep duration must be greater than 0.");
	}

	// Step 3: Vitals & Status
	// Assuming 0 is the default "unselected" state for BMI category

	if (data.heart_rate <= 0) errors.push("Please enter a valid Heart Rate.");
	if (data.systolic_bp <= 0) errors.push("Please enter a valid Systolic BP.");
	if (data.diastolic_bp <= 0)
		errors.push("Please enter a valid Diastolic BP.");

	// Step 4: Model
	if (!data.model) {
		errors.push("Please select a Prediction Model.");
	}

	return {
		success: errors.length === 0,
		errors,
	};
};
