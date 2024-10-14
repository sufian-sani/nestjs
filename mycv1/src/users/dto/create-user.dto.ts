import {IsString, IsNotEmpty, MinLength, IsEmail} from 'class-validator';

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}