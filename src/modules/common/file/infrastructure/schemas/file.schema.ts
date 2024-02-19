import { File } from '@modules/common/file/domain/entities';
import { BaseColumnsSchema } from '@shared/typeOrm/schemas';
import { EntitySchema } from 'typeorm';

export const FileSchema = new EntitySchema<File>({
    name: 'File',
    target: File,
    tableName: 'files',
    columns: {
        ...BaseColumnsSchema,
        name: {
            type: String,
            unique: true
        },
        originalName: {
            type: String
        },
        contentType: {
            type: String
        },
        mimeType: {
            type: String
        },
        extension: {
            type: String
        },
        path: {
            type: String,
            unique: true
        },
        size: {
            type: Number
        },
        isPrivate: {
            type: Boolean,
            default: true
        }
    }
});
