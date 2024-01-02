import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from 'nestjs-minio-client';
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
        TypeOrmModule.forFeature([FileSchema]),
        MinioModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) =>
            {
                return {
                    endPoint: config.getOrThrow('s3.host'),
                    region: config.getOrThrow('s3.region'),
                    accessKey: config.getOrThrow('s3.accessKey'),
                    secretKey: config.getOrThrow('s3.secretKey'),
                    port: config.getOrThrow('s3.port'),
                    useSSL: config.getOrThrow('s3.useSSL')
                };
            }
        })
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
