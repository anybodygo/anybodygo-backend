import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Country} from "../../countries/entities/country.entity";

export class CreateCityDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsNotEmpty()
    country: Country;

    @IsString()
    @IsNotEmpty()
    name: string;
}
