export const getEmailDomain = (email: string): string =>
{
    return email.split('@')[1];
};
