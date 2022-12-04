import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestDirectionDto } from './create-request-direction.dto';
import {IsNotEmpty, IsNumber, IsOptional} from "class-validator";

export class UpdateRequestDirectionDto extends PartialType(CreateRequestDirectionDto) {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    fromCountryId: number;

    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    fromCityId: number;

    @IsNumber()
    @IsNotEmpty()
    toCountryId: number;

    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    toCityId: number;
}
