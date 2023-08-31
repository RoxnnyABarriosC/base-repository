import * as fs from 'fs';
import * as _path from 'path';

interface Props {
    fileName: string;
    extension?: string;
    path?: string;
}

/**
 * This function creates a writable file stream at the specified path with the given file name and extension.
 * @param {object} props - An object containing the properties for creating the file stream.
 * @param {string} props.fileName - The name of the file to be created.
 * @param {string} [props.extension=''] - The extension of the file to be created.
 * @param {string} [props.path=''] - The path where the file should be created.
 * @returns {WriteStream} A writable file stream at the specified path with the given file name and extension.
 */

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
