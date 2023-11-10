import { AuthService } from '@modules/auth/domain/services';
import { StepperLoginDto } from '@modules/auth/presentation/dtos';
import { OTPConfigException } from '@modules/securityConfig/domain/exceptions';
import { OTPService } from '@modules/securityConfig/domain/services';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { User } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestCustomException } from '@shared/exceptions';
import { ErrorModel } from '@shared/models';
import { EncodeText } from '@shared/utils';
import { IsDefined } from 'class-validator';
import { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-custom';

@Injectable()
export class OTPStrategy extends PassportStrategy(Strategy, 'otp')
{
    private readonly logger = new Logger(OTPStrategy.name);

    constructor(
        private readonly authService: AuthService,
        private readonly otpService: OTPService,
        private readonly repository: SecurityConfigRepository,
        private readonly userRepository: UserRepository
    )
    {
        // super({ usernameField: 'emailOrPhone', passReqToCallback: true });
        super();
    }

    async validate(req: FastifyRequest): Promise<User | any>
    {
        const { emailOrPhone, password, emailOTPCode, phoneOTPCode } = req.body as StepperLoginDto;

        const bodyProperties = Object.keys(req.body);

        const user = await this.userRepository.exist({
            condition: [{ email: emailOrPhone }, { phone: emailOrPhone }],
            select: ['phone', 'email']
        });

        const securityConfig = await this.repository.getConfigOfEmailOrPhone(emailOrPhone);

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
            const otpType = this.otpService.getType(otp);

            return {
                ...prev,
                [otpType]: EncodeText(user[otpType], otpType)
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
                req.body as any,
                requiredOTPProperties,
                securityConfig,
                {
                    emailKey: req.headers['email-otp-key'] as string,
                    phoneKey: req.headers['phone-otp-key'] as string
                }
            ),
            {
                checkSuperAdmin: false,
                checkPassword: securityConfig.requiredPassword
            }
        );
    }
}
