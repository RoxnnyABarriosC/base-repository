import configuration from '@config/configuration';
import { Logger } from '@nestjs/common';
import { IConfig } from '@src/config';
import { Client } from 'minio';
import { File } from '../entities';

export class UrlSignService
{
    private readonly logger = new Logger(UrlSignService.name);

    private readonly client: Client;
    private readonly bucket: string;
    private readonly configService: IConfig;
    private readonly expire: number;

    constructor()
    {
        this.configService = configuration();
        this.bucket = this.configService.s3.privateBucket;
        this.expire = this.configService.s3.expire;

        this.client = new Client(
            {
                endPoint: this.configService.s3.host,
                region: this.configService.s3.region,
                accessKey: this.configService.s3.accessKey,
                secretKey: this.configService.s3.secretKey,
                port: this.configService.s3.port,
                useSSL: this.configService.s3.useSSL
            });
    }

    async presignedGetObject(file: File, respHeaders?: { [key: string]: any; }): Promise<string>
    {
        return await this.client.presignedGetObject(this.bucket, file.path, this.expire, respHeaders);
    }
}
