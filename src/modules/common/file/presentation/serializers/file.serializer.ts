import { File } from '@modules/common/file/domain/entities';
import { UrlFileService } from '@modules/common/storage/domain/services';
import { Serializer } from '@shared/classValidator/abstractClass';
import { Expose } from 'class-transformer';

export class FileSerializer extends Serializer
{
    @Expose() public name: string;
    @Expose() public originalName: string;
    @Expose() public path: string;
    @Expose() public isPrivate: string;
    @Expose() public contentType: string;
    @Expose() public mimeType: string;
    @Expose() public extension: string;
    @Expose() public size: number;
    @Expose() public url: string;

    override async build(data: File)
    {
        super.build(data);
        this.url = (await UrlFileService.handle(data, true)) as string;
    }
}
