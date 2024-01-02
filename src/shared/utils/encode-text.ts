type AuthType = 'email' | 'phone';

const mask = (start: number, end: number, text: string) =>
{
    return text.slice(0, start) + '*'.repeat(end - start) + text.slice(end);
};

export const EncodeText = (text: string, type: AuthType): string =>
{
    if (type === 'email')
    {
        const [user, domain] = text.split('@');
        const [domainName, extension] = domain.split('.');
        return `${mask(3, user.length, user)}@${mask(0, domainName.length, domainName)}.${extension}`;
    }
    else if (type === 'phone')
    {
        return mask(5, text.length - 2, text);
    }
    return text;
};
