import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterFile } from 'fastify-file-interceptor';
import { MinioService as _MinioService } from 'nestjs-minio-client';
import { File } from '../entities';
import { MinioRemoveException, MinioUploadException } from '../exceptions';

@Injectable()
export class MinioService
{
    private readonly logger = new Logger(MinioService.name);
    private readonly bucket: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly minioService: _MinioService
    )
    {
        this.bucket = this.configService.getOrThrow('s3.privateBucket');
    }

    async upload(file: MulterFile, fileEntity: File): Promise<void>
    {
        const objectName: string = fileEntity.path;
        const stream: Buffer = file.buffer;
        const metaData = { 'Content-Type': file.mimetype, 'Content-Size': file.size };

        try
        {
            await this.minioService.client.putObject(this.bucket, objectName, stream, metaData);
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
            await this.minioService.client.removeObject(this.bucket, file.path);
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
            await this.minioService.client.removeObjects(this.bucket, files.map(f => f.path));
        }
        catch (error)
        {
            this.logger.error(error);
            throw new MinioRemoveException();
        }
    }
}
