import { ParseBoolean } from '@shared/decorators';
import { IsBoolean, IsOptional } from 'class-validator';

export class SaveFileDto
{
    @IsOptional()
    @IsBoolean()
    @ParseBoolean()
    public isPrivate = false;
}
