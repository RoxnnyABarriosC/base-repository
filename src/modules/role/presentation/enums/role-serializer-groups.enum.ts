import { SCOPE } from '@modules/role/domain/constants';
import { SerializerGroupsEnum } from '@shared/classValidator/enums';

export enum RoleSerializerGroupsEnum {
    ALL = `${SCOPE}${SerializerGroupsEnum.ALL}`,
    ID_AND_TIMESTAMP = `${SCOPE}${SerializerGroupsEnum.ID_AND_TIMESTAMP}`,
    ONLY_ID = `${SCOPE}${SerializerGroupsEnum.ONLY_ID}`,
    ONLY_TIMESTAMP = `${SCOPE}${SerializerGroupsEnum.ONLY_TIMESTAMP}`,
    WITH_PERMISSIONS = `${SCOPE}WITH_PERMISSIONS`,
    WITH_ALLOWED_VIEWS = `${SCOPE}WITH_ALLOWED_VIEWS`,
    WITH_SCOPE_CONFIG = `${SCOPE}WITH_SCOPE_CONFIG`,
}
