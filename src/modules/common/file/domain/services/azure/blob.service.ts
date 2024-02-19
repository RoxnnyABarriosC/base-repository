import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { MinioUploadException } from '@modules/common/file/domain/exceptions';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterFile } from 'fastify-file-interceptor';
import { File } from '../../entities/file.entity';

@Injectable()
export class BlobService
{
    private readonly logger = new Logger(BlobService.name);
    private readonly client: BlobServiceClient;
    private readonly bucket: string;

    constructor(
        private readonly configService: ConfigService
    )
    {
        this.bucket = this.configService.getOrThrow('s3.publicBucket');

        const account = 'bemofactory';
        const accountKey = 'xu7kCJ8oXaqijcP96rGMxE8Xux+BkukAWtfa9Noxy562uPrphvp5eurdItDgDcVDKf640AzxmoYv+AStBfuOhA==';

        const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

        this.client  = new BlobServiceClient(
            `https://${account}.blob.core.windows.net`,
            sharedKeyCredential
        );
    }

    async upload(file: MulterFile, fileEntity: File): Promise<void>
    {
        const objectName: string = fileEntity.path;
        const stream: Buffer = file.buffer;


        try
        {
            const containerClient = this.client.getContainerClient('bemodev');

            const blockBlobClient = containerClient.getBlockBlobClient(objectName);

            const a  = await blockBlobClient.uploadData(stream, {
                blobHTTPHeaders:{
                    blobContentType: file.mimetype
                }
            });

            console.log(a);
        }
        catch (error)
        {
            // this.logger.error(error);
            throw new MinioUploadException();
        }
    }

    // async removeObject(file: File): Promise<void>
    // {
    //     try
    //     {
    //         await this.client.removeObject(this.bucket, file.path);
    //     }
    //     catch (error)
    //     {
    //         this.logger.error(error);
    //         throw new MinioRemoveException();
    //     }
    // }
    //
    // async removeObjects(files: File[]): Promise<void>
    // {
    //     try
    //     {
    //         await this.client.removeObjects(this.bucket, files.map(f => f.path));
    //     }
    //     catch (error)
    //     {
    //         this.logger.error(error);
    //         throw new MinioRemoveException();
    //     }
    // }
}
