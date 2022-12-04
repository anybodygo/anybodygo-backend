import {IsNotEmpty, IsNumber, IsOptional} from "class-validator";

export class CreateRequestDirectionDto {
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
