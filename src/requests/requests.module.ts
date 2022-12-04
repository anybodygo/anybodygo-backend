import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Request} from './entities/request.entity';
import {RequestDirectionsService} from "../request-directions/request-directions.service";
import {RequestDirection} from "../request-directions/entities/request-direction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Request, RequestDirection])],
  controllers: [RequestsController],
  providers: [RequestsService, RequestDirectionsService]
})
export class RequestsModule {}
