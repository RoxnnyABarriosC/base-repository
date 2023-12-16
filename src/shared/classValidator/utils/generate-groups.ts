import { SerializerGroupsEnum } from '../enums';
export const generateGroups = (scope: string = null) =>
{
    return scope ? [
        scope.concat(SerializerGroupsEnum.ALL),
        scope.concat(SerializerGroupsEnum.ONLY_ID),
        scope.concat(SerializerGroupsEnum.ID_AND_TIMESTAMP),
        scope.concat(SerializerGroupsEnum.ONLY_TIMESTAMP)
    ] : [
        SerializerGroupsEnum.ALL,
        SerializerGroupsEnum.ONLY_ID,
        SerializerGroupsEnum.ID_AND_TIMESTAMP,
        SerializerGroupsEnum.ONLY_TIMESTAMP
    ];
};
