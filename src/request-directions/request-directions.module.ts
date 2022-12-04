import { Module } from '@nestjs/common';
import { RequestDirectionsService } from './request-directions.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RequestDirection} from "./entities/request-direction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RequestDirection])],
  providers: [RequestDirectionsService]
})
export class RequestDirectionsModule {}
