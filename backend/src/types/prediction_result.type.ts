import { PredictionModel } from 'src/enums/prediction_model';
import { RecommendationStatus } from 'src/enums/recomendation_status.enum';
import { RecommendationCategory } from 'src/enums/recomendations_category.enum';

export type PredictionResult = {
  model_used: PredictionModel;
  risk_prediction: number;
  risk_probability: number;
  status: 'High Risk';
  recommendations: Recomendation[];
  riskRecomendation: RiskRecomendation;
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
