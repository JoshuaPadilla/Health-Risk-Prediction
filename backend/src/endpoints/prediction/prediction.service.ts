import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PredictionFormDto } from 'src/dto/prediction_form_dto';
import { PredictionResult } from 'src/types/prediction_result.type';

@Injectable()
export class PredictionService {
  constructor(private readonly httpService: HttpService) {}

  async predict(data: PredictionFormDto) {
    const request$ = this.httpService.post(`predict/${data.model}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await lastValueFrom(request$);

    return res.data as PredictionResult;
  }
}
