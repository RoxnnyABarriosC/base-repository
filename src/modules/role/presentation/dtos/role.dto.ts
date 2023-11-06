import { AllowedViewsDto } from '@modules/role/presentation/dtos/allowed-views.dto';
import { PermissionsDto } from '@modules/role/presentation/dtos/permissions.dto';
import { ScopeConfigDto } from '@modules/role/presentation/dtos/scope-config.dto';
import { IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RoleDto extends IntersectionType(
    PermissionsDto,
    AllowedViewsDto,
    ScopeConfigDto
)
{
    @IsString()
    @IsNotEmpty()
    public readonly name: string;

    @IsString()
    @IsNotEmpty()
    public readonly slug: string;
}
