import { IsString } from 'class-validator';

export class SayHelloDto
{
    @IsString()
    message: string;
}
