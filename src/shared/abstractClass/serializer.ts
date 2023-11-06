import { UnixDate } from '@shared/decorators';
import { Exclude, Expose } from 'class-transformer';

export enum SerializerGroupsEnum {
    ALL = 'ALL',
    ID_AND_TIMESTAMP = 'ID_AND_TIMESTAMP',
    ONLY_ID = 'ONLY_ID',
    ONLY_TIMESTAMP = 'ONLY_TIMESTAMP'
}

const groups = (scope: string = null) =>
{
    return scope ? [
        scope.concat(SerializerGroupsEnum.ALL),
        scope.concat(SerializerGroupsEnum.ONLY_ID),
        scope.concat(SerializerGroupsEnum.ID_AND_TIMESTAMP)
    ] : [];
};

export abstract class BaseSerializer<D = any>
{
    public build(data: D): Promise<void> | void
    {
        Object.assign(this, data);
    }
}

export function SerializerScope(scope = null)
{
    class _Serializer extends BaseSerializer
    {
        @Exclude({
            toPlainOnly: true
        })
        public _id: string;

        @Expose({
            name: 'id',
            groups: groups(scope)
        })
        get Id(): string
        {
            return this._id;
        }

        @Expose({
            groups: groups(scope)
        })
        @UnixDate()
        public createdAt: Date | number;

        @Expose({
            groups: groups(scope)
        })
        @UnixDate()
        public updatedAt: Date | number;

        @Expose({
            groups: groups(scope)
        })
        @UnixDate()
        public deletedAt: Date | number;
    }

    return _Serializer;
}

export const Serializer = SerializerScope();
