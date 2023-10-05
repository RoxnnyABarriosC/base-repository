import { SCOPE } from '@modules/auth/role/domain/constants';
import { Role } from '@modules/auth/role/domain/entities';
import { RoleSerializerGroupsEnum } from '@modules/auth/role/presentation/enums';
import { SerializerScope } from '@shared/abstractClass';
import { Expose } from 'class-transformer';


export class RoleSerializer extends SerializerScope(SCOPE)
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
