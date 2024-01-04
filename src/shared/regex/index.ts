export const emailOrPhoneRegex = /^(?:\+\d{1,3}\d{9}|\d{10}|(\d{3}-){2}\d{4}|\(\d{3}\) \d{3}-\d{4})$|^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const emailOrPhoneRegexV2 = /^((\+56)?[ -]?(\d[ -]?){9}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/g;
export const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,24}$/g;

export const passwordGeneratorRegex = /.*[A-Za-z\d@$!%*?&]/;

export const userNameRegex = /^(?<username>[a-zA-Z\d]+)#(?<usernameid>\d+)$/g;

export const stringTrim = /\s+/g;
