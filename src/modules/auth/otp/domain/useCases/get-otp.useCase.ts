import { OTP } from '@modules/auth/otp/domain/entities';
import { OTPRepository } from '@modules/auth/otp/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@src/modules/auth/user/domain/entities';

interface Props {
    authUser: User;
}

@Injectable()
export class GetOTPUseCase
{
    private readonly logger = new Logger(GetOTPUseCase.name);

    constructor(
        private readonly repository: OTPRepository
    )
    {}

    async handle({ authUser }: Props): Promise<OTP>
    {
        return await this.repository.getOneBy({
            condition: { user: { _id: authUser._id } },
            options: {
                initThrow: true
            }
        });
    }
}
