import { PartialType } from '@nestjs/mapped-types';
import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {CreateCityDto} from "./create-city.dto";
import {Country} from "../../countries/entities/country.entity";

export class UpdateCityDto extends PartialType(CreateCityDto) {
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsNotEmpty()
    country: Country;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    name: string;
}
