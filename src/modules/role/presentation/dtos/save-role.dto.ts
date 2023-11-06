import { RoleDto } from '@modules/role/presentation/dtos/role.dto';
import { OmitType } from '@nestjs/swagger';

export class SaveRoleDto extends OmitType(RoleDto, ['slug'] as const)
{ }
