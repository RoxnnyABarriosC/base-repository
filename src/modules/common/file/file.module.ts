import { DeleteFileUseCase, GetFileUseCase, ListFilesUseCase, RestoreFileUseCase, SaveFileUseCase, SaveFilesUseCase } from '@modules/common/file/domain/useCases';
import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { FileController } from '@modules/common/file/presentation/controllers';
import { StorageModule } from '@modules/common/storage';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IStorageConfig } from '@src/config';
import { FileSchema } from './infrastructure/schemas';


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([FileSchema]),
        StorageModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => config.getOrThrow<IStorageConfig>('storage')
        })
    ],
    controllers: [
        FileController
    ],
    providers: [
        FileRepository,
        SaveFileUseCase,
        SaveFilesUseCase,
        GetFileUseCase,
        DeleteFileUseCase,
        RestoreFileUseCase,
        ListFilesUseCase
    ],
    exports: [
        FileRepository
    ]
})
export class FileModule
{ }
