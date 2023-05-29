import { UnixDate } from '@shared/decorators';
import { Exclude, Expose } from 'class-transformer';

export enum SerializerGroupsEnum {
    ID_AND_TIMESTAMP = 'ID_AND_TIMESTAMP',
    ONLY_ID = 'ONLY_ID',
    ONLY_TIMESTAMP = 'ONLY_TIMESTAMP'
}


export abstract class BaseSerializer<D = any>
{
    public build(data: D): Promise<void> | void
    {
        Object.assign(this, data);
    }
}

export function SerializerScope(scope  = '')
{
    class _Serializer extends BaseSerializer
    {
        @Exclude({
            toPlainOnly: true
        })
        public _id: string;

        @Expose({
            name: 'id',
            groups: [
                scope.concat(SerializerGroupsEnum.ONLY_ID),
                scope.concat(SerializerGroupsEnum.ID_AND_TIMESTAMP)
            ]
        })
        get Id(): string
        {
            return this._id;
        }

        @Expose({
            groups: [
                scope.concat(SerializerGroupsEnum.ONLY_TIMESTAMP),
                scope.concat(SerializerGroupsEnum.ID_AND_TIMESTAMP)
            ]
        })
        @UnixDate()
        public createdAt: Date | number;

        @Expose({
            groups: [
                scope.concat(SerializerGroupsEnum.ONLY_TIMESTAMP),
                scope.concat(SerializerGroupsEnum.ID_AND_TIMESTAMP)
            ]
        })
        @UnixDate()
        public updatedAt: Date | number;

        @Expose({
            groups: [
                scope.concat(SerializerGroupsEnum.ONLY_TIMESTAMP),
                scope.concat(SerializerGroupsEnum.ID_AND_TIMESTAMP)
            ]
        })
        @UnixDate()
        public deletedAt: Date | number;
    }

    return _Serializer;
}

export const Serializer = SerializerScope();
