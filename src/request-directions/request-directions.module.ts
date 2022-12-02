import { Module } from '@nestjs/common';
import { RequestDirectionsService } from './request-directions.service';
import { RequestDirectionsController } from './request-directions.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RequestDirection} from "./entities/request-direction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RequestDirection])],
  controllers: [RequestDirectionsController],
  providers: [RequestDirectionsService]
})
export class RequestDirectionsModule {}
