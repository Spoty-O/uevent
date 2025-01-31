import { IsDate, IsNumber, IsString, MinDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsDate()
  @MinDate(new Date())
  @Type(() => Date) // This is necessary because the date is a string
  date: Date;

  @IsNumber()
  companyId: number;
}
