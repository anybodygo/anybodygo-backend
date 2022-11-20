import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsNumber()
  @IsNotEmpty()
  public chatId: number;

  @IsString()
  @IsNotEmpty()
  public chatName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public chatLink: string;

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

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public context: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  public isRewardable: boolean;
}