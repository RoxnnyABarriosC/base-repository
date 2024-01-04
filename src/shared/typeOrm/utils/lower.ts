import { Raw } from 'typeorm';

export const Lower = (value: string) => Raw(filedName => `LOWER((${filedName})::VARCHAR) = '${value.toLocaleLowerCase()}'`);
