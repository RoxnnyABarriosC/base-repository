import { UrlFileInterface, UrlFileService } from '@modules/common/storage/domain/services';
import { RoleSerializer } from '@modules/role/presentation/serializers';
import { SCOPE } from '@modules/user/domain/constants';
import { User } from '@modules/user/domain/entities';
import { GenderEnum } from '@modules/user/domain/enums';
import { SerializerScope } from '@shared/classValidator/abstractClass';
import { ParseUnixDate } from '@shared/classValidator/transforms';
import { Serializer as SerializerMap } from '@shared/classValidator/utils';
import { EmailDomainTypeEnum } from '@shared/enums';
import { Expose } from 'class-transformer';
import { UserSerializerGroupsEnum } from '../enums';

export class UserSerializer extends SerializerScope(SCOPE)
{
    @Expose() public userName: string;
    @Expose() public readonly firstName: string;
    @Expose() public readonly lastName: string;
    @Expose() public readonly email: string;
    @Expose() public readonly phone: string;
    @Expose() public readonly gender: GenderEnum;

    @Expose()
    @ParseUnixDate()
    public readonly birthday: Date | number;

    @Expose() public readonly enable: boolean;
    @Expose() public readonly verify: boolean;
    @Expose() public readonly isSuperAdmin: boolean;
    @Expose() public readonly onBoarding: boolean;
    @Expose() public target: EmailDomainTypeEnum;

    @Expose({
        groups: [
            UserSerializerGroupsEnum.ALL,
            UserSerializerGroupsEnum.WITH_PERMISSIONS
        ]
    })
    public permissions: string[];

    @Expose({
        groups: [
            UserSerializerGroupsEnum.ALL,
            UserSerializerGroupsEnum.WITH_ROLES
        ]
    })
    public roles: RoleSerializer[];

    @Expose() public oAuthFacebook: boolean;
    @Expose() public oAuthGoogle: boolean;
    @Expose() public oAuthApple: boolean;

    @Expose() public mainPicture: UrlFileInterface;
    @Expose() public banner: UrlFileInterface;

    override async build(data: User): Promise<void>
    {
        super.build(data);

        this.userName = data.UserName;

        this.roles = (await SerializerMap(
            data.roles,
            RoleSerializer
        )) as unknown as RoleSerializer[];

        this.oAuthFacebook  = Boolean(data.facebookAccountId);
        this.oAuthGoogle  = Boolean(data.googleAccountId);
        this.oAuthApple  = Boolean(data.appleAccountId);

        this.mainPicture = await UrlFileService.handle(data.mainPicture) as UrlFileInterface;
        this.banner = await UrlFileService.handle(data.banner) as UrlFileInterface;
        this.target = data.Target;
    }
}
