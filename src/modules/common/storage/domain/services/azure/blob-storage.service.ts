import { BlobSASPermissions, BlobServiceClient, ContainerClient, SASProtocol, StorageSharedKeyCredential, generateBlobSASQueryParameters } from '@azure/storage-blob';
import { File } from '@modules/common/file/domain/entities';
import { MODULE_OPTIONS_TOKEN, StorageModuleOptions } from '@modules/common/storage';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MulterFile } from 'fastify-file-interceptor';
import { IStorageService } from '../storage-service.interface';

@Injectable()
export class BlobStorageService implements IStorageService
{
    private readonly logger = new Logger(BlobStorageService.name);
    private readonly client: BlobServiceClient;
    private readonly credentials: StorageSharedKeyCredential;
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

        const account = options.accessKey;
        const accountKey = options.secretKey;

        const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

        const url = `${options.useSSL ? 'https' : 'http'}://${options.host}`;

        this.client  = new BlobServiceClient(url, sharedKeyCredential);

        this.credentials = sharedKeyCredential;
    }

    async hasConnected(initThrow = false): Promise<boolean>
    {
        try
        {
            await this.client.listContainers().next();
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

        try
        {
            const containerClient = this.client.getContainerClient(this.getStorage(fileEntity.isPrivate));

            const blockBlobClient = containerClient.getBlockBlobClient(objectName);

            await blockBlobClient.uploadData(stream, {
                blobHTTPHeaders:{
                    blobContentType: file.mimetype
                }
            });
        }
        catch (error)
        {
            this.logger.error(error);
            throw error;
        }
    }

    async removeObject(file: File): Promise<void>
    {
        const objectName: string = file.path;

        try
        {
            const containerClient = this.client.getContainerClient(this.getStorage(file.isPrivate));

            const blockBlobClient = containerClient.getBlockBlobClient(objectName);

            await blockBlobClient.delete({ deleteSnapshots: 'include' });
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

            const generatePromises = (paths: string[], container: ContainerClient) =>
            {
                return paths.map(p =>
                {
                    const blockBlobClient = container.getBlockBlobClient(p);

                    return () => blockBlobClient.delete({ deleteSnapshots: 'include' });
                });
            };

            if (privatePath.length)
            {
                const container = this.client.getContainerClient(this.getStorage(true));

                promises.push(...generatePromises(privatePath, container));
            }

            if (publicPath.length)
            {
                const container = this.client.getContainerClient(this.getStorage(false));

                promises.push(...generatePromises(publicPath, container));
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
        const containerClient = this.client.getContainerClient(this.getStorage(file.isPrivate));
        const blobClient = containerClient.getBlockBlobClient(file.path);

        // Define los permisos y la duración de la firma
        const permissions = BlobSASPermissions.parse('r'); // Permisos de solo lectura
        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + this.expire); // La firma expirará en 1 hora

        // Genera los parámetros de la firma
        const sasQueryParameters = generateBlobSASQueryParameters(
            {
                blobName: file.path,
                containerName: this.getStorage(file.isPrivate),
                permissions,
                expiresOn: expiryDate,
                protocol: SASProtocol.Https
            },
            this.credentials // Credenciales de acceso
        );

        // Construye la URL completa con la firma
        return `${blobClient.url}?${sasQueryParameters.toString()}`;
    }
}
