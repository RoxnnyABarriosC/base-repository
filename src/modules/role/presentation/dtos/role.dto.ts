import { IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AllowedViewsDto } from './allowed-views.dto';
import { PermissionsDto } from './permissions.dto';
import { ScopeConfigDto } from './scope-config.dto';

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
