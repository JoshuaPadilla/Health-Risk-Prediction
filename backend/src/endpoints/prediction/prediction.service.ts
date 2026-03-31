import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { PredictionFormDto } from 'src/dto/prediction_form_dto';
import { PredictionRecord } from 'src/entities/prediction-record.entity';
import { PredictionResult } from 'src/types/prediction_result.type';
import { Repository } from 'typeorm';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(PredictionRecord)
    private readonly predictionRecordRepository: Repository<PredictionRecord>,
  ) {}

  async predict(data: PredictionFormDto) {
    this.logger.log('Prediction request received', { model: data.model });

    try {
      const request$ = this.httpService.post(`predict/${data.model}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await lastValueFrom(request$);
      const result = res.data as PredictionResult;
      this.logger.log('Prediction result received', {
        riskStatus: result,
      });

      this.logger.log('Creating prediction record...');
      const record = this.predictionRecordRepository.create({ ...data });
      this.logger.log('Record created, saving to database...');

      const saved = await this.predictionRecordRepository.save(record);
      this.logger.log('Record saved successfully', { recordId: saved.id });

      return result;
    } catch (error) {
      this.logger.error('Error during prediction or save', error);
      throw error;
    }
  }

  async findAll(): Promise<PredictionRecord[]> {
    return this.predictionRecordRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
