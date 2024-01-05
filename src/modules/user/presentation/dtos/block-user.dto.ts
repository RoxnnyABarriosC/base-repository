import { MustBeNull } from '@shared/classValidator/decorators';
import { Parse } from '@shared/classValidator/transforms';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class BlockUserDto
{
    @IsBoolean()
    public readonly enable: boolean;

    @IsOptional()
    @IsDate()
    @MustBeNull('enable', false)
    @Parse()
    public readonly blockedAt: Date;
}
