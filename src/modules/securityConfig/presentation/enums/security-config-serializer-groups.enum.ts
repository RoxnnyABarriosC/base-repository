import { SCOPE } from '@modules/securityConfig/domain/constants';
import { SerializerGroupsEnum } from '@shared/classValidator/enums';

export enum SecurityConfigSerializerGroupsEnum {
    ALL = `${SCOPE}${SerializerGroupsEnum.ALL}`
}
