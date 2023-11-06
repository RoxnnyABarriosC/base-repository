import { PasswordDto } from '@modules/user/presentation/dtos';
import { IsString, Length } from 'class-validator';

// TODO: agregar estas configuraciones a las variables de entorno
export class ChangeMyPasswordDto extends PasswordDto
{
    @IsString()
    @Length(5, 20)
    public currentPassword: string;
}
