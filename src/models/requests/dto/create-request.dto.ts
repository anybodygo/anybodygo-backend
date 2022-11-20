import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsNumber()
  @IsNotEmpty()
  public chatId: number;

  @IsNumber()
  @IsNotEmpty()
  public messageId: number;

  @IsString()
  @IsNotEmpty()
  public from: string;

  @IsString()
  @IsNotEmpty()
  public to: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public dateFrom: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public dateTo: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public message: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  public isRewardable: boolean;
}