import { BaseSerializer } from '@shared/abstractClass';
import { Expose } from 'class-transformer';

export class OtpConfigSerializer extends BaseSerializer
{
    @Expose()
    public readonly enable: boolean;

    @Expose()
    public readonly providers: object;

    @Expose()
    public readonly attempts: object;

    override async build(data: unknown): Promise<void>
    {
        super.build(data);
    }
}
