import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PredictionFormDto } from 'src/dto/prediction_form_dto';
import { PredictionService } from './prediction.service';

@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('predict')
  predictForest(@Body() body: PredictionFormDto) {
    return this.predictionService.predict(body);
  }

  @Get('records')
  getRecords() {
    return this.predictionService.findAll();
  }
}
