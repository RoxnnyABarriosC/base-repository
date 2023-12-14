import { AuthService } from '@modules/auth/domain/services';
import { StepperLoginDto } from '@modules/auth/presentation/dtos';
import { OTPPropertiesToTargetDictionary } from '@modules/securityConfig/domain/dictionaries/otp-properties-to-target.dictionary';
import { OTPConfigException } from '@modules/securityConfig/domain/exceptions';
import { OTPService, SecurityConfigService } from '@modules/securityConfig/domain/services';
import { AuthOTPDto } from '@modules/securityConfig/presentation/dtos';
import { User } from '@modules/user/domain/entities';
import { UserService } from '@modules/user/domain/services';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestCustomException } from '@shared/exceptions';
import { ErrorModel } from '@shared/models';
import { EncodeText } from '@shared/utils';
import { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-custom';

@Injectable()
export class OTPStrategy extends PassportStrategy(Strategy, 'otp')
{
    private readonly logger = new Logger(OTPStrategy.name);

    constructor(
        private readonly authService: AuthService,
        private readonly otpService: OTPService,
        private readonly userService: UserService,
        private readonly service: SecurityConfigService
    )
    {
        super();
    }

    async validate(req: FastifyRequest): Promise<User | any>
    {
        const { emailOrPhone, password, emailOTPCode, phoneOTPCode } = req.body as StepperLoginDto;

        const bodyProperties = Object.keys(req.body);

        const user = await this.userService.getEmailAndPhone(emailOrPhone);

        const securityConfig = await this.service.getConfigOfEmailOrPhone(emailOrPhone);

        const requiredOTPProperties = this.otpService.getRequiredProperties(securityConfig);

        if (securityConfig.requiredPassword && !password)
        {
            throw new BadRequestCustomException([new ErrorModel({
                property: 'password',
                constraints: { isDefined: 'password should not be null or undefined' }
            })]);
        }

        const values  = requiredOTPProperties.reduce((prev, otp) =>
        {
            const target = OTPPropertiesToTargetDictionary.get(otp);

            return {
                ...prev,
                [target]: EncodeText(user[target], target)
            };
        }, {});

        if (requiredOTPProperties.length)
        {
            const existOtpProperties =  requiredOTPProperties.every((c) => bodyProperties.includes(c));

            if (!existOtpProperties || !requiredOTPProperties.some(c => !!req.body[c]))
            {
                throw new OTPConfigException(requiredOTPProperties, values);
            }
        }

        return await this.authService.validateUser(
            emailOrPhone?.toLowerCase(),
            password,
            await this.otpService.checkOtp(
                req.body as AuthOTPDto,
                requiredOTPProperties
            ),
            {
                checkSuperAdmin: false,
                checkPassword: securityConfig.requiredPassword
            }
        );
    }
}
