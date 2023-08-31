import { SlugGenerator } from '@shared/utils';
import { describe, expect } from 'vitest';

describe('SlugGenerator', () =>
{
    it('string to slug', () =>
    {
        const string = 'Hello WORLD  2023';
        const slug = SlugGenerator(string);

        expect(slug).toBe('hello-world-2023');
    });
});
