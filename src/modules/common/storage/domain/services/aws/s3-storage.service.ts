import { File } from '@modules/common/file/domain/entities';
import { MODULE_OPTIONS_TOKEN, StorageModuleOptions } from '@modules/common/storage';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MulterFile } from 'fastify-file-interceptor';
import { Client } from 'minio';
import { IStorageService } from '../storage-service.interface';

@Injectable()
export class S3StorageService implements IStorageService
{
    private readonly logger = new Logger(S3StorageService.name);
    private readonly client: Client;
    private readonly privateStorage: string;
    private readonly publicStorage: string;
    private readonly expire: number;

    constructor(
        @Inject(MODULE_OPTIONS_TOKEN) private readonly options: StorageModuleOptions
    )
    {
        this.publicStorage = options.publicStorage;
        this.privateStorage = options.privateStorage;
        this.expire = options.signExpires;

        this.client = new Client(
            {
                endPoint: options.host,
                region: options.region,
                accessKey: options.accessKey,
                secretKey: options.secretKey,
                port: options.port,
                useSSL: options.useSSL
            });
    }

    async hasConnected(initThrow = false): Promise<boolean>
    {
        try
        {
            await this.client.listBuckets();
            return true;
        }
        catch (error)
        {
            this.logger.error(error);

            if (initThrow)
            {
                throw error;
            }

            return false;
        }
    }

    getStorage(isPrivate: boolean): string
    {
        return isPrivate ? this.privateStorage : this.publicStorage;
    }

    async upload(file: MulterFile, fileEntity: File): Promise<void>
    {
        const objectName: string = fileEntity.path;
        const stream: Buffer = file.buffer;
        const metaData = { 'Content-Type': file.mimetype, 'Content-Size': file.size };

        try
        {
            await this.client.putObject(this.getStorage(fileEntity.isPrivate), objectName, stream, metaData);
        }
        catch (error)
        {
            this.logger.error(error);
            throw error;
        }
    }

    async removeObject(file: File): Promise<void>
    {
        try
        {
            await this.client.removeObject(this.getStorage(file.isPrivate), file.path);
        }
        catch (error)
        {
            this.logger.error(error);
            throw error;
        }
    }

    async removeObjects(files: File[]): Promise<void>
    {
        try
        {
            const privatePath = files.filter(f => f.isPrivate).map(f => f.path);
            const publicPath = files.filter(f => !f.isPrivate).map(f => f.path);

            const promises = [];

            if (privatePath.length)
            {
                promises.push(() => this.client.removeObjects(this.privateStorage, privatePath));
            }

            if (publicPath.length)
            {
                promises.push(() => this.client.removeObjects(this.publicStorage, publicPath));
            }

            await Promise.all(promises.map(p => p()));
        }
        catch (error)
        {
            this.logger.error(error);
            throw error;
        }
    }

    async presignedGetObject(file: File): Promise<string>
    {
        const headers = {
            'Content-Type': file.contentType,
            'Content-Length': file.size
        };

        return await this.client.presignedGetObject(this.getStorage(file.isPrivate), file.path, this.expire, headers);
    }
}
