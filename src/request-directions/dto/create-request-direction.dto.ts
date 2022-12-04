import {IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {Request} from "../../requests/entities/request.entity";

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

    @IsOptional()
    @IsNotEmpty()
    request: Request;
}
