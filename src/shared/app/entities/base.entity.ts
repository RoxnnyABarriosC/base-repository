import { CloneDeepMap } from '@shared/utils/clone-deep-map';
import { Exclude, Expose, plainToClassFromExist } from 'class-transformer';
import { v4 as uuidV4 } from 'uuid';

declare interface IPartialBuildOptions
{
    allowNull?: boolean;
    validate?: boolean;
    _this?: object;
}

@Exclude()
export abstract class BaseEntity<T = any>
{
    public _id: string;
    @Expose() public createdAt: Date | number;
    @Expose() public updatedAt: Date | number;
    @Expose() public deletedAt?: Date | number | null;

    protected constructor()
    {
        this._id = uuidV4();
    }

    build(data: Partial<T>, validate = true)
    {
        if (data)
        {
            Object.assign(this, validate
                ? plainToClassFromExist(
                    this,
                    data,
                    {
                        excludeExtraneousValues: true,
                        enableCircularCheck: true,
                        exposeDefaultValues: true
                    })
                : data
            );
        }
    }

    partialBuild(data: Partial<T>, { allowNull = false, validate = false, _this }: IPartialBuildOptions = {})
    {
        const propertiesUpdate = Object.keys(data).reduce((prev, property) =>
        {
            const value = data[property];

            return {
                ...prev,
                ...((value !== null && value !== undefined) || (allowNull && value === null) ? { [property]:value } : {})
            };
        }, {});

        Object.assign(_this ?? this, validate
            ? plainToClassFromExist(
                _this ?? this,
                propertiesUpdate,
                {
                    excludeExtraneousValues: true,
                    enableCircularCheck: true,
                    exposeDefaultValues: true
                })
            : propertiesUpdate
        );
    }

    clone(newId = false): this
    {
        const clone = CloneDeepMap(this, true);

        if (newId)
        {
            clone._id = uuidV4();
        }

        return clone;
    }
}
