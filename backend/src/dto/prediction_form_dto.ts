import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Department } from 'src/enums/department.enum';
import { PredictionModel } from 'src/enums/prediction_model';

export class PredictionFormDto {
  @IsNumber()
  @IsNotEmpty()
  gender: number;

  @IsEnum(Department, {
    message:
      'department must be one of COM, CCIS, CAT, CEA, CCJS, COED, or CON',
  })
  department: Department;

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
