import { PartialType } from '@nestjs/mapped-types';
import { CreateCountryDto } from './create-country.dto';
import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    flag: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
