import configuration from '@config/configuration';
import { File } from '@modules/common/file/domain/entities';
import { UrlSignService } from '@modules/common/file/domain/services/url-sign.service';
import { Logger } from '@nestjs/common';

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

                let url = await singUrlService.presignedGetObject(file, metadata);
                const config = configuration();

                if (config.s3.exposeHost)
                {
                    url = url.replace(`${config.s3.host}${ config.s3.port && config.s3.port !== 443 ? `:${config.s3.port}` : ''}`, config.s3.exposeHost);
                }

                if (config.s3.exposeHttps && !config.s3.useSSL)
                {
                    url = url.replace('http', 'https');
                }

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
