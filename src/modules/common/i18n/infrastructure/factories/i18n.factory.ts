import { ConfigService } from '@nestjs/config';
import { I18nOptionsWithoutResolvers } from 'nestjs-i18n/dist/interfaces/i18n-options.interface';
import path from 'path';

export const i18nFactory = async(configService: ConfigService): Promise<I18nOptionsWithoutResolvers> =>
{
    return {
        fallbackLanguage: configService.getOrThrow('locale'),
        loaderOptions: {
            path: path.join(process.cwd(), 'dist/config/locales/'),
            watch: true
        },
        typesOutputPath: path.join(process.cwd(), 'src/config/locales/i18n.generated.ts')
    };
};
