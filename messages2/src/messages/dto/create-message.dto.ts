import { IsString, Length } from 'class-validator';

export class CreateMessageDto {
    @IsString()
    content: string;
}