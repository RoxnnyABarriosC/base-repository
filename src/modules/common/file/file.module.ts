import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioService } from './domain/services';
import {
    DeleteFileUseCase,
    GetFileUseCase,
    ListFilesUseCase,
    RestoreFileUseCase, SaveFileUseCase, SaveFilesUseCase
} from './domain/useCases';
import { FileRepository } from './infrastructure/repositories';
import { FileSchema } from './infrastructure/schemas';
import { FileController } from './presentation/controllers';


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
