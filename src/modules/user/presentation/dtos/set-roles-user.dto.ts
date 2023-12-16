import { ArraySet } from '@shared/classValidator/transforms';
import { IsArray, IsUUID } from 'class-validator';

export class SetRolesUserDto
{
    @IsArray()
    @IsUUID('4', { each: true })
    @ArraySet()
    public rolesIds: string[];
}

