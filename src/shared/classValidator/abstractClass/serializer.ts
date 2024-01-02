import { Exclude, Expose } from 'class-transformer';
import { ParseUnixDate } from '../transforms';
import { generateGroups } from '../utils';

export abstract class BaseSerializer<D = any>
{
    public build(data: D): Promise<void> | void
    {
        Object.assign(this, data);
    }
}

export const SerializerScope = (scope = null) =>
{
    class _Serializer extends BaseSerializer
    {
        @Exclude({
            toPlainOnly: true
        })
        public _id: string;

        @Expose({
            name: 'id',
            groups: generateGroups(scope)
        })
        get Id(): string
        {
            return this._id;
        }

        @Expose({
            groups: generateGroups(scope)
        })
        @ParseUnixDate()
        public createdAt: Date | number;

        @Expose({
            groups: generateGroups(scope)
        })
        @ParseUnixDate()
        public updatedAt: Date | number;

        @Expose({
            groups: generateGroups(scope)
        })
        @ParseUnixDate()
        public deletedAt: Date | number;
    }

    return _Serializer;
};

export const Serializer = SerializerScope();
