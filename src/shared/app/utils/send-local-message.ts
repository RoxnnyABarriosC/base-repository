import { I18nContext } from 'nestjs-i18n';
export interface ILocalMessage
{
    message: string;
    messageCode: string;
    args?: object;
}

/**
 * This function sends a local message by translating a message key using the current I18nContext.
 * @param {() => string} fn - A function that returns the message key to be translated.
 * @returns {ILocalMessage} An object containing the translated message and the message key.
 */
export const SendLocalMessage = (fn: () => string, args?: object): ILocalMessage  =>
{
    const key = fn();
    const message = I18nContext.current().translate(key, { args }) as string;

    return { message, messageCode: key, args };
};
