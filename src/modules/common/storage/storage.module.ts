import { S3StorageService } from '@modules/common/storage/domain/services/aws';
import { BlobStorageService } from '@modules/common/storage/domain/services/azure';
import { ConfigurableModuleBuilder, DynamicModule, Global, Module } from '@nestjs/common';

export type StorageModuleOptions = {
    type: 's3' | 'blob';
    host: string;
    accessKey: string;
    secretKey: string;
    port: number;
    useSSL: boolean;
    rootPath: string;
    region: string;
    signExpires: number;
    publicStorage: string;
    privateStorage: string;
}

export const {
    ConfigurableModuleClass,
    MODULE_OPTIONS_TOKEN,
    ASYNC_OPTIONS_TYPE
} =
  new ConfigurableModuleBuilder<StorageModuleOptions>() .setExtras(
      {
          isGlobal: true
      },
      (definition, extras) => ({
          ...definition,
          global: extras.isGlobal
      })
  ).build();


export const STORAGE_SERVICE = 'STORAGE_SERVICE';

@Global()
@Module({})
export class StorageModule extends ConfigurableModuleClass
{
    static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule
    {
        const config = super.registerAsync(options);

        return {
            ...config,
            providers:[
                ...config.providers,
                {
                    provide: STORAGE_SERVICE,
                    useFactory: async(_options: StorageModuleOptions) =>
                    {
                        const typeStorage = _options.type;

                        const storages = {
                            s3: S3StorageService,
                            blob: BlobStorageService
                        };

                        if (!storages[_options.type])
                        {
                            throw new Error('Invalid storage service');
                        }

                        const fileService = new storages[typeStorage](_options);

                        await fileService.hasConnected(true);

                        return fileService;
                    },
                    inject: [MODULE_OPTIONS_TOKEN]
                }
            ],
            exports: [
                STORAGE_SERVICE
            ]
        };
    }
}
