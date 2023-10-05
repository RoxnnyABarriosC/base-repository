import { OtpProvidersEnum } from '@modules/auth/otp/domain/enums';
import { IsArray, IsEnum, IsString } from 'class-validator';

export class SetProvidersDto
{
    @IsEnum(OtpProvidersEnum, { each: true })
    @IsString({ each: true })
    @IsArray()
    public readonly providers: OtpProvidersEnum[];
}
