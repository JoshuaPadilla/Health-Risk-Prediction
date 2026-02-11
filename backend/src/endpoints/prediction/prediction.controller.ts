import { Body, Controller, Post } from '@nestjs/common';
import { PredictionService } from './prediction.service';

@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post('forest')
  predictForest(@Body() body: any) {
    return this.predictionService.forestPredict(body);
  }
}
