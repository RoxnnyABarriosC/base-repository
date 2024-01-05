import { AuthService } from '@modules/auth/domain/services';
import { OTPLoginDto } from '@modules/auth/presentation/dtos';
import { AuthOTPDto } from '@modules/securityConfig/presentation/dtos';
import { User } from '@modules/user/domain/entities';
import { UserService } from '@modules/user/domain/services';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestCustomException } from '@shared/app/exceptions';
import { ErrorModel } from '@shared/classValidator/models';
import { EncodeText } from '@shared/utils';
import { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-custom';
import { OTPPropertiesToTargetDictionary } from '../dictionaries';
import { OTPConfigException } from '../exceptions';
import { OTPService, SecurityConfigService } from '../services';

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
        const { emailOrPhone, password } = req.body as OTPLoginDto;

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

        return await this.authService.otpAuthenticate(
            emailOrPhone?.toLowerCase(),
            password,
            await this.otpService.checkOtp(
                req.body as AuthOTPDto,
                requiredOTPProperties
            ),
            securityConfig.requiredPassword
        );
    }
}
