import { SCOPE } from '@modules/otp/domain/constants';
import { SerializerGroupsEnum } from '@shared/abstractClass';

export enum OTPSerializerGroupsEnum {
    ALL = `${SCOPE}${SerializerGroupsEnum.ALL}`
}
