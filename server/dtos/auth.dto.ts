import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from "class-validator";

class UserRegistrationDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  sexualPreferences: string;

  @IsString()
  @IsNotEmpty()
  biography: string;

  @IsString()
  @IsNotEmpty()
  profilePictureUrl: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  fameRating: number;

  @IsNumber()
  @IsNotEmpty()
  gpsLatitude: number;

  @IsNumber()
  @IsNotEmpty()
  gpsLongitude: number;

  @IsString()
  @IsNotEmpty()
  lastSeen: string;

  @IsString()
  @IsNotEmpty()
  birthDate: string;
}

class UserLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export { UserRegistrationDto, UserLoginDto };
