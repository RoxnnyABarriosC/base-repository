import { User } from '@modules/auth/user/domain/entities';
import {
    UserSerializer
} from '@modules/auth/user/presentation/serializers';

export class AuthUserSerializer extends UserSerializer
{
    override async build(data: User)
    {
        await super.build(data);
        this.permissions = data.Permissions;
    }
}
