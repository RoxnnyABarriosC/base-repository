import { RoleSerializer } from '@modules/auth/role/presentation/serializers';
import { SCOPE } from '@modules/auth/user/domain/constants';
import { User } from '@modules/auth/user/domain/entities';
import { GenderEnum } from '@modules/auth/user/domain/enums';
import { UrlFileInterface, UrlFileService } from '@modules/common/file/domain/services';
import { SerializerGroupsEnum, SerializerScope } from '@shared/abstractClass';
import { UnixDate } from '@shared/decorators';
import { Serializer as SerializerMap } from '@shared/utils';
import { Exclude, Expose } from 'class-transformer';

export enum UserSerializerGroupsEnum {
    ALL = `${SCOPE}ALL`,
    ID_AND_TIMESTAMP = `${SCOPE}${SerializerGroupsEnum.ID_AND_TIMESTAMP}`,
    ONLY_TIMESTAMP = `${SCOPE}${SerializerGroupsEnum.ONLY_TIMESTAMP}`,
    ONLY_ID = `${SCOPE}${SerializerGroupsEnum.ONLY_ID}`,
    WITH_PERMISSIONS = `${SCOPE}WITH_PERMISSIONS`,
    WITH_ROLES = `${SCOPE}WITH_ROLE`,
}

export class UserSerializer extends SerializerScope(SCOPE)
{
    @Expose() public readonly userName: string;
    @Expose() public readonly firstName: string;
    @Expose() public readonly lastName: string;
    @Expose() public readonly email: string;
    @Expose() public readonly phone: string;
    @Expose() public readonly gender: GenderEnum;

    @Expose()
    @UnixDate()
    public readonly birthday: Date | number;

    @Expose() public readonly enable: boolean;
    @Expose() public readonly verify: boolean;
    @Expose() public readonly isSuperAdmin: boolean;
    @Expose() public readonly firstLogin: boolean;

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


    @Expose() public mainPicture: UrlFileInterface;
    @Expose() public banner: UrlFileInterface;


    override async build(data: User): Promise<void>
    {
        super.build(data);
        this.roles = (await SerializerMap(
            data.roles,
            RoleSerializer
        )) as unknown as RoleSerializer[];

        this.mainPicture = await UrlFileService.handle(data.mainPicture) as UrlFileInterface;
        this.banner = await UrlFileService.handle(data.banner) as UrlFileInterface;
    }
}
