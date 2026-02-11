import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PredictionService {
  constructor(private readonly httpService: HttpService) {}

  async forestPredict(data: any) {
    const request$ = this.httpService.post('predict/forest', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await lastValueFrom(request$);

    return res.data;
  }
}
