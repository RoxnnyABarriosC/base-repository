import { OTPProvidersEnum, OTPTargetConfigEnum } from '@modules/securityConfig/domain/enums';

export type OTPConfigType = {
    [key in OTPTargetConfigEnum]: {
        enable: boolean;
        providers?: OTPProvidersEnum[];
    }
}
