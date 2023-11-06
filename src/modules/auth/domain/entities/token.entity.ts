import { BaseEntity } from '@shared/entities';
import { Exclude, Expose } from 'class-transformer';
import type { IDecodeToken } from '@modules/auth/domain/models';

export interface IHash
{
    value: string;
    expires: number;
    payload: IDecodeToken | any;
    blackListed: boolean
}

@Exclude()
export class Token extends BaseEntity
{
    @Expose() public hash: IHash = {
        value: null,
        expires: 0,
        payload: {},
        blackListed: false
    };

    constructor(data?: Partial<Token>)
    {
        super();
        this.build(data, false);
    }
}
