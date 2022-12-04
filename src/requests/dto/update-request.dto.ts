import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestDto } from './create-request.dto';
import {IsArray, IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
    @IsArray()
    @IsNotEmpty()
    public from: string[];

    @IsArray()
    @IsNotEmpty()
    public to: string[];

    @IsDate()
    @IsNotEmpty()
    public dateFrom: Date;

    @IsDate()
    @IsNotEmpty()
    public dateTo: Date;

    @IsString()
    @IsNotEmpty()
    public message: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    public context: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    public volume: string;

    @IsBoolean()
    @IsOptional()
    @IsNotEmpty()
    public hasReward: boolean;
}
