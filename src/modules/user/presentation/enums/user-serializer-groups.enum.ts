import { SCOPE } from '@modules/user/domain/constants';
import { SerializerGroupsEnum } from '@shared/classValidator/enums';

export enum UserSerializerGroupsEnum {
    ALL = `${SCOPE}ALL`,
    ID_AND_TIMESTAMP = `${SCOPE}${SerializerGroupsEnum.ID_AND_TIMESTAMP}`,
    ONLY_TIMESTAMP = `${SCOPE}${SerializerGroupsEnum.ONLY_TIMESTAMP}`,
    ONLY_ID = `${SCOPE}${SerializerGroupsEnum.ONLY_ID}`,
    WITH_PERMISSIONS = `${SCOPE}WITH_PERMISSIONS`,
    WITH_ROLES = `${SCOPE}WITH_ROLE`,
}
