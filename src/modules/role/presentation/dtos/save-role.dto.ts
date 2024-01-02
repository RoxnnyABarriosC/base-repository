import { OmitType } from '@nestjs/swagger';
import { RoleDto } from './role.dto';

export class SaveRoleDto extends OmitType(RoleDto, ['slug'] as const)
{ }
