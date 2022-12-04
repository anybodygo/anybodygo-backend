import {
    IsArray,
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString
} from 'class-validator';
import {Type} from "class-transformer";

export class CreateRequestDto {
    @IsNumber()
    @IsNotEmpty()
    public chatId: number;

    @IsNumber()
    @IsNotEmpty()
    public messageId: number;

    @IsNumber()
    @IsNotEmpty()
    public userId: number;

    @IsString()
    @IsNotEmpty()
    public chatName: string;

    @IsString()
    @IsNotEmpty()
    public chatLink: string;

    @IsString()
    @IsNotEmpty()
    public messageLink: string;

    @IsArray()
    @IsNotEmpty()
    public from: string[];

    @IsArray()
    @IsNotEmpty()
    public to: string[];

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    public dateFrom: Date;

    @Type(() => Date)
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

    @IsArray()
    @IsOptional()
    @IsNotEmpty()
    public directions: any;
}
