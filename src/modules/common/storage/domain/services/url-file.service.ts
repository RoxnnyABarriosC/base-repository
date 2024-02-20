import configuration from '@config/configuration';
import { File } from '@modules/common/file/domain/entities';
import { S3StorageService } from '@modules/common/storage/domain/services/aws';
import { BlobStorageService } from '@modules/common/storage/domain/services/azure';
import { Logger } from '@nestjs/common';
import { IStorageService } from './storage-service.interface';

export interface UrlFileInterface {
    id: string;
    url: string;
}

export class UrlFileService
{
    private readonly logger = new Logger(UrlFileService.name);
    private static storage: IStorageService;

    private static init(): IStorageService
    {
        const config = configuration().storage;

        if (this.storage)
        {
            return this.storage;
        }

        const storages = {
            s3: S3StorageService,
            blob: BlobStorageService
        };

        if (!storages[config.type])
        {
            throw new Error('Invalid storage service');
        }

        this.storage = new storages[config.type](config);

        return this.storage;
    }

    static async handle(data: File | File[], onlyUrl = false): Promise<(UrlFileInterface | string) | (UrlFileInterface | string)[]>
    {
        const singUrlService = UrlFileService.init();

        const transform = async(file: File): Promise<UrlFileInterface | string> =>
        {
            if (file)
            {
                const url = await singUrlService.presignedGetObject(file);

                return  onlyUrl ? url : { id: file._id, url };
            }
            else
            {
                return null;
            }
        };

        if (Array.isArray(data))
        {
            return await Promise.all(data.map(async(_data) =>
            {
                return transform(_data);
            }));
        }
        else
        {
            return await transform(data);
        }
    }
}
