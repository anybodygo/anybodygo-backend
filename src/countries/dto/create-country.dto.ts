import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateCountryDto {
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
