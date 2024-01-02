import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterFile } from 'fastify-file-interceptor';
import { Client } from 'minio';
import { File } from '../entities';
import { MinioRemoveException, MinioUploadException } from '../exceptions';

@Injectable()
export class MinioService
{
    private readonly logger = new Logger(MinioService.name);
    private readonly client: Client;
    private readonly bucket: string;

    constructor(
        private readonly configService: ConfigService
    )
    {
        this.bucket = this.configService.getOrThrow('s3.publicBucket');

        this.client = new Client(
            {
                endPoint: this.configService.getOrThrow('s3.host'),
                region: this.configService.getOrThrow('s3.region'),
                accessKey: this.configService.getOrThrow('s3.accessKey'),
                secretKey: this.configService.getOrThrow('s3.secretKey'),
                port: this.configService.getOrThrow('s3.port'),
                useSSL: this.configService.getOrThrow('s3.useSSL')
            });
    }

    async upload(file: MulterFile, fileEntity: File): Promise<void>
    {
        const objectName: string = fileEntity.path;
        const stream: Buffer = file.buffer;
        const metaData = { 'Content-Type': file.mimetype, 'Content-Size': file.size };

        try
        {
            await this.client.putObject(this.bucket, objectName, stream, metaData);
        }
        catch (error)
        {
            this.logger.error(error);
            throw new MinioUploadException();
        }
    }

    async removeObject(file: File): Promise<void>
    {
        try
        {
            await this.client.removeObject(this.bucket, file.path);
        }
        catch (error)
        {
            // eslint-disable-next-line no-console
            this.logger.error(error);
            throw new MinioRemoveException();
        }
    }

    async removeObjects(files: File[]): Promise<void>
    {
        try
        {
            await this.client.removeObjects(this.bucket, files.map(f => f.path));
        }
        catch (error)
        {
            this.logger.error(error);
            throw new MinioRemoveException();
        }
    }
}
