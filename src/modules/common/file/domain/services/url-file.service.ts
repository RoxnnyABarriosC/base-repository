import { Logger } from '@nestjs/common';
import { File } from '../entities';
import { UrlSignService } from '../services';

export interface UrlFileInterface {
    id: string;
    url: string;
}

export class UrlFileService
{
    private readonly logger = new Logger(UrlFileService.name);

    static async handle(data: File | File[], onlyUrl = false): Promise<(UrlFileInterface | string) | (UrlFileInterface | string)[]>
    {
        const singUrlService = new UrlSignService();

        const transform = async(file: File): Promise<UrlFileInterface | string> =>
        {
            if (file)
            {
                const metadata = {
                    'Content-Type': file.contentType,
                    'Content-Length': file.size
                };

                const url = await singUrlService.presignedGetObject(file, metadata);

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
