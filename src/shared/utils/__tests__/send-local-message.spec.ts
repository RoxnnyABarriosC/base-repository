import { SendLocalMessage } from '@shared/app/utils';
import { I18nContext } from 'nestjs-i18n';
import { describe, expect, it, vi } from 'vitest';

describe('SendLocalMessage', () =>
{
    it('should to be return an object', async() =>
    {
        vi.spyOn(I18nContext, 'current').mockReturnValue(<any>{
            translate: vi.fn((key: string) => 'translate_message')
        });
        const message = SendLocalMessage(() => 'error.key');

        expect(Object.keys(message).length).toBe(3);
        expect(message.message).toBe('translate_message');
        expect(message.messageCode).toBe('error.key');
    });
});
