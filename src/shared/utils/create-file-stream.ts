import * as fs from 'fs';
import * as _path from 'path';

interface Props {
    fileName: string;
    extension?: string;
    path?: string;
}

export const CreateFileStream = ({ fileName, path = '', extension = '' }: Props) =>
{
    const filePath = _path.join(path, `${fileName}${extension}`);

    try
    {
        if (path.length)
        {
            fs.mkdirSync(_path.join(path));
        }
    }
    catch (err)
    {
        if (err['code'] !== 'EEXIST')
        {
            throw err;
        }
    }

    return fs.createWriteStream(filePath, { flags: 'a' });
};
