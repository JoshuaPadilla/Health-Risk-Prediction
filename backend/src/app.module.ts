import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PredictionModule } from './endpoints/prediction/prediction.module';
import { PredictionRecord } from './entities/prediction-record.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'kurt',
      password: 'kurt123',
      database: 'kurt_thesis',
      entities: [PredictionRecord],
      synchronize: true,
    }),

    PredictionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
