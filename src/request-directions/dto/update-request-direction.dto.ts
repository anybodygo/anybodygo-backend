import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestDirectionDto } from './create-request-direction.dto';

export class UpdateRequestDirectionDto extends PartialType(CreateRequestDirectionDto) {}
