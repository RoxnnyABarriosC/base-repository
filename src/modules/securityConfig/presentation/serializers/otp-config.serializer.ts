import { BaseSerializer } from '@shared/classValidator/abstractClass';
import { Expose } from 'class-transformer';

export class OTPConfigSerializer extends BaseSerializer
{
    @Expose()
    public readonly enable: boolean;

    @Expose()
    public readonly providers: object;

    override async build(data: unknown): Promise<void>
    {
        super.build(data);
    }
}
