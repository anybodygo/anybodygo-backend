import { Module } from '@nestjs/common';
import { RequestsModule } from './requests.module';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';

@Module({
  imports: [RequestsModule],
  providers: [RequestsService],
  controllers: [RequestsController]
})
export class UsersHttpModule {}
