import { LocalMessageInterface } from '@shared/interfaces';
import { I18nContext } from 'nestjs-i18n';

export const SendLocalMessage = (fn: () => string): LocalMessageInterface  =>
{
    const key = fn();
    const message = I18nContext.current().translate(key) as string;

    return { message, messageCode: key };
};
