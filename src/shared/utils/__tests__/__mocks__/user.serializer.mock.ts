import { BaseSerializer } from '@shared/classValidator/abstractClass';
import { Exclude, Expose } from 'class-transformer';

export interface UserSerializerMockInterface {
    id: string;
    fullName: string;
    email: string;
    defaultValue: boolean;
}

export class UserSerializerMock extends BaseSerializer
{
    @Exclude({
        toPlainOnly: true
    })
    public readonly _id: number;

    @Expose({ name: 'id' })
    public get Id()
    {
        return this._id;
    }

    @Exclude({
        toPlainOnly: true
    })
    public readonly firstName: string;

    @Exclude({
        toPlainOnly: true
    })
    public readonly lastName: string;

    @Expose({ name: 'fullName' })
    public get FullName()
    {
        return `${this.firstName} ${this.lastName}`;
    }

    @Expose() public readonly email: string;

    @Expose() public readonly defaultValue = true;

    override async build(data: Partial<UserSerializerMock>): Promise<void>
    {
        super.build(data);
    }
}
