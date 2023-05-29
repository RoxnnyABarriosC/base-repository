import { MinioService } from '@modules/common/file/domain/services';
import {
    DeleteFileUseCase,
    GetFileUseCase,
    ListFilesUseCase,
    RestoreFileUseCase, SaveFileUseCase, SaveFilesUseCase
} from '@modules/common/file/domain/useCases';
import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { FileSchema } from '@modules/common/file/infrastructure/schemas';
import { FileController } from '@modules/common/file/presentation/controllers';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([FileSchema])
    ],
    controllers: [
        FileController
    ],
    providers: [
        FileRepository,
        MinioService,
        SaveFileUseCase,
        SaveFilesUseCase,
        GetFileUseCase,
        DeleteFileUseCase,
        RestoreFileUseCase,
        ListFilesUseCase
    ],
    exports: [
        MinioService,
        FileRepository
    ]
})
export class FileModule
{}
