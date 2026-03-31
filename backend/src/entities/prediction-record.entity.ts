import { Department } from 'src/enums/department.enum';
import { PredictionModel } from 'src/enums/prediction_model';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('prediction_records')
export class PredictionRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Input fields ---
  @Column()
  gender: number;

  @Column({ type: 'enum', enum: Department, nullable: true })
  department: Department | null;

  @Column('float')
  height: number;

  @Column('float')
  weight: number;

  @Column()
  age: number;

  @Column('float')
  sleep_duration: number;

  @Column()
  physical_activity: number;

  @Column()
  daily_steps: number;

  @Column()
  stress_level: number;

  @Column()
  quality_of_sleep: number;

  @Column()
  bmi_category: number;

  @Column()
  heart_rate: number;

  @Column()
  systolic_bp: number;

  @Column()
  diastolic_bp: number;

  @Column({ type: 'enum', enum: PredictionModel })
  model: PredictionModel;

  @CreateDateColumn()
  createdAt: Date;
}
