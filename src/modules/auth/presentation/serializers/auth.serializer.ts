import { JWTModel } from '@modules/auth/domain/models';
import { BaseSerializer } from '@shared/classValidator/abstractClass';
import { Serializer } from '@shared/classValidator/utils';
import { Expose } from 'class-transformer';
import { AuthUserSerializer } from './index';

export class AuthSerializer extends BaseSerializer
{
    @Expose() public user: AuthUserSerializer;
    @Expose() public expires: number;
    @Expose() public token: string;

    override async build(data: JWTModel)
    {
        this.user = (await Serializer(
            data.User,
            AuthUserSerializer
        )) as unknown as AuthUserSerializer;
        this.expires = data.Expires;
        this.token = data.Hash;
    }
}
