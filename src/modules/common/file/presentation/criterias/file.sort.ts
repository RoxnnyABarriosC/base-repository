import { User } from '@modules/user/domain/entities';
import { DefaultSorts, Sort } from '@shared/criteria/abstractClass';
import { IsSort } from '@shared/criteria/decorators';
import { SortEnum } from '@shared/criteria/enums';

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

    override DefaultSorts(): DefaultSorts<User>
    {
        return [
            { createdAt: SortEnum.DESC }
        ];
    }
}
