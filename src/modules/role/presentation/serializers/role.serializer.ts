import { SCOPE } from '@modules/role/domain/constants';
import { Role } from '@modules/role/domain/entities';
import { SerializerScope } from '@shared/classValidator/abstractClass';
import { Expose } from 'class-transformer';
import { RoleSerializerGroupsEnum } from '../enums';

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
