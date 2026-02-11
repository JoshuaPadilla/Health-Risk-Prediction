import { IsNumber, IsEnum, IsNotEmpty, Min, Max } from 'class-validator';
import { PredictionModel } from 'src/enums/prediction_model';

export class PredictionFormDto {
  @IsNumber()
  @IsNotEmpty()
  gender: number;

  @IsNumber()
  @Min(0)
  height: number;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsNumber()
  @Min(0)
  @Max(120)
  age: number;

  @IsNumber()
  @Min(0)
  @Max(24)
  sleep_duration: number;

  @IsNumber()
  physical_activity: number;

  @IsNumber()
  daily_steps: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  stress_level: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  quality_of_sleep: number;

  @IsNumber()
  bmi_category: number;

  @IsNumber()
  heart_rate: number;

  @IsNumber()
  systolic_bp: number;

  @IsNumber()
  diastolic_bp: number;

  @IsEnum(PredictionModel, {
    message: 'model must be either logistic, svm, or forest',
  })
  model: PredictionModel;
}
