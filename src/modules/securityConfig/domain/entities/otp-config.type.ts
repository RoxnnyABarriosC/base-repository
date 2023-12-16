import { OTPProvidersEnum, OTPTargetConfigEnum } from '../enums';

export type OTPConfigType = {
    [key in OTPTargetConfigEnum]: {
        enable: boolean;
        providers?: OTPProvidersEnum[];
    }
}
