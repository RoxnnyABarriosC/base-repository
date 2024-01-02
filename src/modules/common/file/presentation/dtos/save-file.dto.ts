import { Parse } from '@shared/classValidator/transforms';
import { IsBoolean, IsOptional } from 'class-validator';

export class SaveFileDto
{
    @IsOptional()
    @IsBoolean()
    @Parse()
    public readonly isPrivate: boolean;
}
