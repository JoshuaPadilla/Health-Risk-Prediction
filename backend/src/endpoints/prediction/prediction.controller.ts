import { Body, Controller, Post } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionFormDto } from 'src/dto/prediction_form_dto';

@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post('predict')
  predictForest(@Body() body: PredictionFormDto) {
    console.log(body);
    return this.predictionService.predict(body);
  }
}
