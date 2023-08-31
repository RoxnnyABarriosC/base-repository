import { handlebars } from '@src/shared/utils/handlebars';
import { describe, expect, it } from 'vitest';

describe('Handlebars', () =>
{
    it('should to be return a stringify object', () =>
    {
        const template = handlebars.compile('<pre>{{json myObject}}</pre>');
        const context = { myObject: { a: 1, b: 2 } };
        const html = template(context);
        const deleteHtml = html.replace(/&quot|;|<\w+>|<[/]\w+>/gi, '');
        const transformContext = JSON.stringify(context.myObject).replace(/["]/g, '');
        expect(deleteHtml).toBe(transformContext);
    });
});
