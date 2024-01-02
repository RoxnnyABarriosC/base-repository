import { Protected } from '@modules/auth/presentation/decorators';
import { MimeTypeEnum } from '@modules/common/file/domain/enums';
import {
    DeleteFileUseCase,
    GetFileUseCase,
    ListFilesUseCase,
    RestoreFileUseCase,
    SaveFileUseCase,
    SaveFilesUseCase
} from '@modules/common/file/domain/useCases';
import { FilePermissionsEnum } from '@modules/common/file/file.permissions';
import { UserFilter, UserSort } from '@modules/user/presentation/criterias';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Patch, Post } from '@nestjs/common';
import { ALL_MANAGE_PERMISSION } from '@shared/app/constants';
import { ManagePermissions, RequirePermissions } from '@shared/app/decorators';
import { Serializer } from '@shared/classValidator/utils';
import { CriteriaBuilder, IUris } from '@shared/criteria';
import { Criteria, Filter, Pagination, Sort, Uris } from '@shared/criteria/decorators';
import { PaginationFilter } from '@shared/criteria/filters';
import { DeletePermanently, PartialRemoved, UUID } from '@shared/decorators';
import { MulterFile } from 'fastify-file-interceptor';
import { UploadFile, UploadFileFields, UploadFiles, UploadedFile, UploadedFiles } from '../decorators';
import { UploadedFileFields } from '../decorators/uploaded-file-fields.decorator';
import { SaveFileDto } from '../dtos/save-file.dto';
import { FileSerializer } from '../serializers';

@Controller({
    path: 'files',
    version: '1'
})
@Protected()
@ManagePermissions(ALL_MANAGE_PERMISSION, FilePermissionsEnum.MANAGE)
export class FileController
{
    private readonly logger = new Logger(FileController.name);

    constructor(
        private readonly saveUseCase: SaveFileUseCase,
        private readonly saveManyUseCase: SaveFilesUseCase,
        private readonly getUseCase: GetFileUseCase,
        private readonly deleteUseCase: DeleteFileUseCase,
        private readonly restoreUseCase: RestoreFileUseCase,
        private readonly listUseCase: ListFilesUseCase
    )
    {}

    @Get()
    @Criteria()
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(FilePermissionsEnum.LIST)
    async list(
        @Filter() filters: UserFilter,
        @Sort() sorts: UserSort,
        @Pagination() pagination: PaginationFilter,
        @Uris() uris: IUris
    )
    {
        const criteria = new CriteriaBuilder({
            filters,
            sorts,
            pagination,
            uris
        });

        return (await Serializer(
            await this.listUseCase.handle({
                criteria
            }), FileSerializer)) as typeof FileSerializer[];
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(FilePermissionsEnum.SHOW)
    async get(
        @UUID() id: string,
        @PartialRemoved() partialRemoved?: boolean

    )
    {
        return (await Serializer(
            await this.getUseCase.handle({
                id,
                partialRemoved
            }),
            FileSerializer
        )) as typeof FileSerializer;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(FilePermissionsEnum.DELETE)
    async delete(
        @UUID() id: string,
        @DeletePermanently() deletePermanently?: boolean
    )
    {
        return (await Serializer(await this.deleteUseCase.handle({
            id,
            deletePermanently
        }), FileSerializer)) as typeof FileSerializer;
    }

    @Patch(':id/restore')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(FilePermissionsEnum.RESTORE)
    async restore(
        @UUID() id: string
    )
    {
        return (await Serializer(await this.restoreUseCase.handle({
            id
        }), FileSerializer)) as typeof FileSerializer;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UploadFile()
    @RequirePermissions(FilePermissionsEnum.SAVE)
    async save(
        @UploadedFile({
            fileType: [MimeTypeEnum.WEBP, MimeTypeEnum.PNG]
        }) rawFile: MulterFile,
        @Body() dto: SaveFileDto
    )
    {
        return (await Serializer(
            await this.saveUseCase.handle({
                rawFile,
                dto
            }),
            FileSerializer
        )) as typeof FileSerializer;
    }

    @Post('many')
    @HttpCode(HttpStatus.CREATED)
    @UploadFiles()
    @RequirePermissions(FilePermissionsEnum.SAVE_MANY)
    async saveMany(
        @UploadedFiles({
            fileType: [MimeTypeEnum.WEBP, MimeTypeEnum.PNG, MimeTypeEnum.WEBM],
            maxSize: 1
        }) rawFiles: MulterFile[],
        @Body() dto: SaveFileDto
    )
    {
        return (await Serializer(
            await this.saveManyUseCase.handle({
                rawFiles,
                dto
            }),
            FileSerializer
        )) as typeof FileSerializer[];
    }

    @Post('many-v2')
    @HttpCode(HttpStatus.CREATED)
    @UploadFileFields({
        fields:[
            { name: 'file1', maxCount: 1 },
            { name: 'file2', maxCount: 1 }
        ]
    })
    @RequirePermissions(FilePermissionsEnum.SAVE_MANY)
    async saveMany2(
      @UploadedFileFields({
          fields: [
              { name: 'file1', fileType: [MimeTypeEnum.WEBM], maxSize: 10 },
              { name: 'file2' }
          ],
          maxSize: 1,
          fileType: MimeTypeEnum.PNG
      })
      { file1:[rawFile1], file2:[rawFile2] }: Record<string, MulterFile[]>,
      @Body() dto: SaveFileDto
    )
    {
        return (await Serializer(
            await this.saveManyUseCase.handle({
                rawFiles: [rawFile1, rawFile2],
                dto
            }),
            FileSerializer
        )) as typeof FileSerializer[];
    }
}
