import { AuthUserSerializer } from '@modules/auth/index/presentation/serializers/auth-user.serializer';
import { BaseSerializer } from '@shared/abstractClass';
import { Serializer as SerializerMap } from '@shared/utils';
import { Expose } from 'class-transformer';
import { JwtModel } from '../../domain/models/JWT.model';

export class AuthSerializer extends BaseSerializer
{
    @Expose() public user: AuthUserSerializer;
    @Expose() public expires: number;
    @Expose() public token: string;

    override async build(data: JwtModel)
    {
        this.user = (await SerializerMap(
            data.User,
            AuthUserSerializer
        )) as unknown as AuthUserSerializer;
        this.expires = data.Expires;
        this.token = data.Hash;
    }
}
