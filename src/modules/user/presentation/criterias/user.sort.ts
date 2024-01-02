import { User } from '@modules/user/domain/entities';
import { DefaultSorts, Sort } from '@shared/criteria/abstractClass';
import { IsSort } from '@shared/criteria/decorators';
import { SortEnum } from '@shared/criteria/enums';

export class UserSort extends Sort
{
    @IsSort()
    public readonly userName: SortEnum;

    @IsSort()
    public readonly firstName: SortEnum;

    @IsSort()
    public readonly lastName: SortEnum;

    @IsSort()
    public readonly email: SortEnum;

    @IsSort()
    public readonly phone: SortEnum;

    @IsSort()
    public readonly gender: SortEnum;

    @IsSort()
    public readonly birthday: SortEnum;

    @IsSort()
    public readonly enable: SortEnum;

    @IsSort()
    public readonly verify: SortEnum;

    @IsSort()
    public readonly isSuperAdmin: SortEnum;

    @IsSort()
    public readonly createdAt: SortEnum;

    @IsSort()
    public readonly updatedAt: SortEnum;

    @IsSort()
    public readonly deletedAt: SortEnum;

    override DefaultSorts(): DefaultSorts<User>
    {
        return [
            { createdAt: SortEnum.DESC }
        ];
    }
}
