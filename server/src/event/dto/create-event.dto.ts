import { IsDate, IsString, MinDate } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsDate()
  @MinDate(new Date())
  date: Date;
}
