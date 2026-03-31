import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { PredictionFormDto } from 'src/dto/prediction_form_dto';
import { PredictionRecord } from 'src/entities/prediction-record.entity';
import { PredictionResult } from 'src/types/prediction_result.type';
import { Repository } from 'typeorm';

@Injectable()
export class PredictionService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(PredictionRecord)
    private readonly predictionRecordRepository: Repository<PredictionRecord>,
  ) {}

  async predict(data: PredictionFormDto) {
    const request$ = this.httpService.post(`predict/${data.model}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await lastValueFrom(request$);
    const result = res.data as PredictionResult;

    const record = this.predictionRecordRepository.create({ ...data });
    await this.predictionRecordRepository.save(record);

    return result;
  }

  async findAll(): Promise<PredictionRecord[]> {
    return this.predictionRecordRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
