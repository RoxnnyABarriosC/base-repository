import { User } from '@modules/auth/user/domain/entities';
import {
    UserSerializer,
    UserSerializerGroupsEnum
} from '@modules/auth/user/presentation/serializers';
import { OmitType } from '@nestjs/swagger';
import { BaseSerializer } from '@shared/abstractClass';
import { Serializer as SerializerMap } from '@shared/utils';
import { Expose } from 'class-transformer';
import { JwtModel } from '../../domain/models/JWT.model';

export class AuthUserSerializer extends UserSerializer
{
    override async build(data: User)
    {
        await super.build(data);
        this.permissions = data.Permissions;
    }
}
