import { EntitySchemaColumnOptions } from 'typeorm';

interface BaseColumns {
    _id: EntitySchemaColumnOptions;
    createdAt: EntitySchemaColumnOptions;
    updatedAt: EntitySchemaColumnOptions;
    deletedAt?: EntitySchemaColumnOptions;
}

export const BaseColumnsSchema: BaseColumns = {
    _id: {
        type: 'uuid',
        primary: true,
        unique: true
    },
    createdAt: {
        name: 'createdAt',
        type: 'timestamp with time zone',
        createDate: true
    },
    updatedAt: {
        name: 'updatedAt',
        type: 'timestamp with time zone',
        updateDate: true
    },
    deletedAt: {
        name: 'deletedAt',
        type: 'timestamp with time zone',
        nullable: true,
        deleteDate: true
    }
};
