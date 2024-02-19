import { BlobSASPermissions, BlobServiceClient, SASProtocol, StorageSharedKeyCredential, generateBlobSASQueryParameters } from '@azure/storage-blob';
import configuration from '@config/configuration';
import { Logger } from '@nestjs/common';
import { IConfig } from '@src/config';
import { Client } from 'minio';
import { File } from '../../entities';

export class UrlSignService
{
    private readonly logger = new Logger(UrlSignService.name);

    private readonly client: BlobServiceClient;
    private readonly bucket: string;
    private readonly configService: IConfig;
    private readonly expire: number;
    private readonly credentials: StorageSharedKeyCredential;

    constructor()
    {
        this.configService = configuration();
        this.bucket = this.configService.s3.privateBucket;
        this.expire = this.configService.s3.expire;

        const account = 'bemofactory';
        const accountKey = 'xu7kCJ8oXaqijcP96rGMxE8Xux+BkukAWtfa9Noxy562uPrphvp5eurdItDgDcVDKf640AzxmoYv+AStBfuOhA==';

        const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

        this.client  = new BlobServiceClient(
            `https://${account}.blob.core.windows.net`,
            sharedKeyCredential
        );

        this.credentials = sharedKeyCredential;
    }

    async presignedGetObject(file: File, respHeaders?: { [key: string]: any; }): Promise<string>
    {
        const containerClient = this.client.getContainerClient('bemodev');
        const blobClient = containerClient.getBlockBlobClient(file.path);

        // Define los permisos y la duración de la firma
        const permissions = BlobSASPermissions.parse('r'); // Permisos de solo lectura
        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + this.expire); // La firma expirará en 1 hora

        // Genera los parámetros de la firma
        const sasQueryParameters = generateBlobSASQueryParameters(
            {
                blobName: file.path,
                containerName: 'bemodev',
                permissions,
                expiresOn: expiryDate,
                protocol: SASProtocol.Https // Protocolo HTTPS para mayor seguridad
            },
            this.credentials // Credenciales de acces
        );

        // Construye la URL completa con la firma
        return `${blobClient.url}?${sasQueryParameters.toString()}`;
    }
}
