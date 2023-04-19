import { IsEmail, IsString, Length } from 'class-validator';

export class userInput {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 2000)
  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 50)
  password: string;
}

export class userUpdateInput {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 2000)
  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 50)
  password: string;
}
