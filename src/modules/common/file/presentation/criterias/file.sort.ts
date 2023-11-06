import { User } from '@modules/user/domain/entities';
import { DefaultSorts, Sort } from '@shared/abstractClass';
import { IsSort } from '@shared/decorators';
import { SortEnum } from '@shared/enums';
import { Expose } from 'class-transformer';

export class FileSort extends Sort
{
    @IsSort()
    public readonly name: SortEnum;

    @IsSort()
    public readonly originalName: SortEnum;

    @IsSort()
    public readonly mimeType: SortEnum;

    @IsSort()
    public readonly extension: SortEnum;

    @IsSort()
    public readonly path: SortEnum;

    @IsSort()
    public readonly isPrivate: SortEnum;

    @IsSort()
    public readonly contentType: SortEnum;

    @IsSort()
    public readonly size: SortEnum;

    @IsSort()
    public readonly createdAt: SortEnum;

    @IsSort()
    public readonly updatedAt: SortEnum;

    @IsSort()
    public readonly deletedAt: SortEnum;

    @Expose()
    get DefaultSorts(): DefaultSorts<User>
    {
        return [
            { createdAt: SortEnum.DESC }
        ];
    }
}
