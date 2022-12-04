import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateCityDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    countryId: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}
