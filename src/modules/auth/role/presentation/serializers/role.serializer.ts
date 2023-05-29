import { Role } from '@modules/auth/role/domain/entities';
import { SerializerGroupsEnum, SerializerScope } from '@shared/abstractClass';
import { Expose } from 'class-transformer';

const scope = 'ROLE:';
export enum RoleSerializerGroupsEnum {
    ALL = `${scope}ALL`,
    ID_AND_TIMESTAMP = `${scope}${SerializerGroupsEnum.ID_AND_TIMESTAMP}`,
    ONLY_ID = `${scope}${SerializerGroupsEnum.ONLY_ID}`,
    ONLY_TIMESTAMP = `${scope}${SerializerGroupsEnum.ONLY_TIMESTAMP}`,
    WITH_PERMISSIONS = `${scope}WITH_PERMISSIONS`,
    WITH_ALLOWED_VIEWS = `${scope}WITH_ALLOWED_VIEWS`,
    WITH_SCOPE_CONFIG = `${scope}WITH_SCOPE_CONFIG`,
}

export class RoleSerializer extends SerializerScope(scope)
{
    @Expose() public name: string;
    @Expose() public slug: string;
    @Expose() public enable: boolean;
    @Expose() public ofSystem: boolean;

    @Expose({
        groups: [
            RoleSerializerGroupsEnum.ALL,
            RoleSerializerGroupsEnum.WITH_PERMISSIONS
        ]
    })
    public permissions: string[];

    @Expose({
        groups: [
            RoleSerializerGroupsEnum.ALL,
            RoleSerializerGroupsEnum.WITH_ALLOWED_VIEWS
        ]
    })
    public allowedViews: string[];

    @Expose({
        groups: [
            RoleSerializerGroupsEnum.ALL,
            RoleSerializerGroupsEnum.WITH_SCOPE_CONFIG
        ]
    })
    public scopeConfig: object;

    override async build(data: Role)
    {
        super.build(data);
    }
}
