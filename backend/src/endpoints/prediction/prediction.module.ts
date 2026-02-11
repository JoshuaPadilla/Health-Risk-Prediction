import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      baseURL: 'http://localhost:8001/',
    }),
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
