import { PickType } from '@nestjs/swagger';
import { SaveRoleDto } from './save-role.dto';

export class UpdateRoleDto extends PickType(SaveRoleDto, ['name'] as const)
{ }

