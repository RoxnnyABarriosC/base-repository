import { BaseEntity } from '@shared/app/entities';
import { Expose } from 'class-transformer';
import { MulterFile } from 'fastify-file-interceptor';

export class File extends BaseEntity
{
    @Expose() public name: string;
    @Expose() public originalName: string;
    @Expose() public mimeType: string;
    @Expose() public extension: string;
    @Expose() public path: string;
    @Expose() public isPrivate: boolean;
    @Expose() public contentType: string;
    @Expose() public size: number;

    constructor(rawFile: MulterFile, isPrivate = true, validate?: boolean)
    {
        super();

        if (rawFile)
        {
            this.build({
                originalName: rawFile.originalname,
                size: rawFile.size,
                isPrivate
            } as Partial<File>, validate);

            this.ContentType = rawFile.mimetype;

            void this.generateUUIDName();

            this.setPath();
        }
    }

    public set ContentType(value: string)
    {
        this.contentType = value;
        this.mimeType = (this.contentType.split('/'))[1];
        this.extension = '.'.concat(this.mimeType);
    }

    public generateUUIDName(): void
    {
        if (!this.mimeType)
        {
            throw new Error('mimeType is not defined');
        }

        this.name =  this._id.toString().concat(`.${this.mimeType}`);
    }

    public setPath(fn = () => ''): void
    {
        if (!this.contentType)
        {
            throw new Error('contentType is not defined');
        }

        this.path = fn().concat(`${this.name}`);
    }
}
