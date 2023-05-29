import { TableColumn, TableColumnOptions } from 'typeorm';

export const basicPropertiesMigration: TableColumnOptions[] = [
    new TableColumn({
        name: '_id',
        type: 'uuid',
        isPrimary: true,
        isUnique: true
    }),
    new TableColumn({
        name: 'createdAt',
        type: 'timestamp with time zone',
        default: 'now()'
    }),
    new TableColumn({
        name: 'updatedAt',
        type: 'timestamp with time zone',
        default: 'now()'
    }),
    new TableColumn({
        name: 'deletedAt',
        type: 'timestamp with time zone',
        isNullable: true
    })
];
