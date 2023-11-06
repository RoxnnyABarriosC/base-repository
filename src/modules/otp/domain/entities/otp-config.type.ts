import { OtpProvidersEnum, OtpTypeEnum } from '@modules/otp/domain/enums';

export type OtpConfigType = {
    [key in OtpTypeEnum]: {
        value: string;
        enable: boolean;
        expireTime: Date;
        attempts: number;
        providers?: OtpProvidersEnum[];
    }
}
