import { IsNumber, IsString, Length } from 'class-validator';

export class taskInput {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsString()
  @Length(1, 2000)
  description: string;

  @IsString()
  @Length(1, 50)
  status: string;
}

export class taskUpdateInput {
  @IsNumber()
  id: number;

  @IsString()
  @Length(1, 100)
  title: string;

  @IsString()
  @Length(1, 2000)
  description: string;

  @IsString()
  @Length(1, 50)
  status: string;
}
