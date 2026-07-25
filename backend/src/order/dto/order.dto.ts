import {
  IsString,
  IsNumber,
  IsEmail,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TicketDto {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @IsString()
  daytime: string;

  @IsString()
  @IsOptional()
  day: string;

  @IsString()
  @IsOptional()
  time: string;

  @IsNumber()
  row: number;

  @IsNumber()
  seat: number;

  @IsNumber()
  price: number;
}

export class OrderDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}
