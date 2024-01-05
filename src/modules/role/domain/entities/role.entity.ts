import { BaseEntity } from '@shared/app/entities';
import { SlugGenerator } from '@shared/utils';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Role extends BaseEntity
{
    @Expose() public name: string;
    @Expose() public slug: string;
    @Expose() public enable: boolean;
    @Expose() public ofSystem: boolean;
    @Expose() public permissions: string[] = [];
    @Expose() public allowedViews: string[] = [];
    @Expose() public scopeConfig: object = {};

    constructor(data?: Partial<Role>, validate?: boolean)
    {
        super();
        this.build(data, validate);
    }

    set Permissions(permissions: string | string[])
    {
        permissions = Array.isArray(permissions) ? permissions : [permissions];

        this.permissions = permissions;
    }

    set AllowedViews(allowedViews: string | string[])
    {
        allowedViews = Array.isArray(allowedViews) ? allowedViews : [allowedViews];

        if (Array.isArray(this.allowedViews))
        {
            this.allowedViews.push(...new Set([...allowedViews as string[]]));
        }
        else
        {
            this.allowedViews = allowedViews;
        }
    }

    set Slug(name: string)
    {
        this.slug = SlugGenerator(name);
    }
}

