import { OTPProvidersEnum } from '@modules/securityConfig/domain/enums';
import { IsArray, IsEnum, IsString } from 'class-validator';

export class SetProvidersDto
{
    @IsEnum(OTPProvidersEnum, { each: true })
    @IsString({ each: true })
    @IsArray()
    public readonly providers: OTPProvidersEnum[];
}
