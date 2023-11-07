import { SCOPE } from '@modules/securityConfig/domain/constants';
import { SerializerGroupsEnum } from '@shared/abstractClass';

export enum SecurityConfigSerializerGroupsEnum {
    ALL = `${SCOPE}${SerializerGroupsEnum.ALL}`
}
