import { File } from '@modules/common/file/domain/entities';
import { MulterFile } from 'fastify-file-interceptor';

export interface IStorageService
{
    getStorage(isPrivate: boolean): string;
    hasConnected(initThrow?: boolean): Promise<boolean>;
    upload(file: MulterFile, fileEntity: File): Promise<void>;
    removeObject(file: File): Promise<void>;
    removeObjects(files: File[]): Promise<void>;
    presignedGetObject(file: File): Promise<string>;
}
