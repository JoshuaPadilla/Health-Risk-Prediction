import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      baseURL: 'http://localhost:8001/api/fast/',
    }),
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
