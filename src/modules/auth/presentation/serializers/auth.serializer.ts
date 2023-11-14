import { JWTModel } from '@modules/auth/domain/models';
import { AuthUserSerializer } from '@modules/auth/presentation/serializers/auth-user.serializer';
import { BaseSerializer } from '@shared/abstractClass';
import { Serializer as SerializerMap } from '@shared/utils';
import { Expose } from 'class-transformer';

export class AuthSerializer extends BaseSerializer
{
    @Expose() public user: AuthUserSerializer;
    @Expose() public expires: number;
    @Expose() public token: string;

    override async build(data: JWTModel)
    {
        this.user = (await SerializerMap(
            data.User,
            AuthUserSerializer
        )) as unknown as AuthUserSerializer;
        this.expires = data.Expires;
        this.token = data.Hash;
    }
}
