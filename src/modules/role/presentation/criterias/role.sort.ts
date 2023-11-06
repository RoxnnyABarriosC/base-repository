import { Role } from '@modules/role/domain/entities';
import { DefaultSorts, Sort } from '@shared/abstractClass';
import { IsSort } from '@shared/decorators';
import { Expose } from 'class-transformer';

export class RoleSort extends Sort
{
    @IsSort()
    public readonly name: string;

    @IsSort()
    public readonly slug: string;

    @IsSort()
    public readonly enable: string;

    @IsSort()
    public readonly ofSystem: string;

    @IsSort()
    public readonly createdAt: string;

    @IsSort()
    public readonly updatedAt: string;

    @IsSort()
    public readonly deletedAt: string;

    @Expose()
    get DefaultSorts(): DefaultSorts<Role>
    {
        return [
            { createdAt: 'desc' }
        ];
    }
}
