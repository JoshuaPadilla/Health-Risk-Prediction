export type PredictionForm = {
	gender: number;
	height: number;
	weight: number;
	age: number;
	sleep_duration: number;
	physical_activity: number;
	daily_steps: number;
	stress_level: number;
	quality_of_sleep: number;
	bmi_category: number;
	heart_rate: number;
	systolic_bp: number;
	diastolic_bp: number;
	model: "logistic" | "svm" | "forest";
};
