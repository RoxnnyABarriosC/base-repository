import { Role } from '@modules/role/domain/entities';
import { DefaultSorts, Sort } from '@shared/criteria/abstractClass';
import { IsSort } from '@shared/criteria/decorators';
import { SortEnum } from '@shared/criteria/enums';
import { Expose } from 'class-transformer';

export class RoleSort extends Sort
{
    @IsSort()
    public readonly name: SortEnum;

    @IsSort()
    public readonly slug: SortEnum;

    @IsSort()
    public readonly enable: SortEnum;

    @IsSort()
    public readonly ofSystem: SortEnum;

    @IsSort()
    public readonly createdAt: SortEnum;

    @IsSort()
    public readonly updatedAt: SortEnum;

    @IsSort()
    public readonly deletedAt: SortEnum;

    @Expose()
    get DefaultSorts(): DefaultSorts<Role>
    {
        return [
            { createdAt: SortEnum.DESC }
        ];
    }
}
