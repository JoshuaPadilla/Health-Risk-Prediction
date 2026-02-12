import type { Model } from "@/enums/models.enum";
import type { RecommendationCategory } from "@/enums/recommendation_category.enum";
import type { RecommendationStatus } from "@/enums/recommendation_status.enum";

export type PredictionResult = {
	model_used: Model;
	risk_prediction: number;
	risk_probability: number;
	status: "High Risk";
	recommendations: Recomendation[];
	riskRecommendation: RiskRecomendation;
};

type Recomendation = {
	category: RecommendationCategory;
	status: RecommendationStatus;
	title: string;
	message: string;
	color: string;
};

type RiskRecomendation = {
	title: string;
	status: RecommendationStatus;
	score: number;
	message: string;
	icon: string;
};
