import { ILocalMessage } from '@shared/interfaces';
import { I18nContext } from 'nestjs-i18n';

/**
 * This function sends a local message by translating a message key using the current I18nContext.
 * @param {() => string} fn - A function that returns the message key to be translated.
 * @returns {ILocalMessage} An object containing the translated message and the message key.
 */
export const SendLocalMessage = (fn: () => string): ILocalMessage  =>
{
    const key = fn();
    const message = I18nContext.current().translate(key) as string;

    return { message, messageCode: key };
};
