import { BaseEntity } from '@shared/entities';
import { Exclude, Expose } from 'class-transformer';
import type { DecodeTokenInterface } from '@modules/auth/index/domain/models';

export interface hashInterface {
    value: string;
    expires: number;
    payload: DecodeTokenInterface | any;
    blackListed: boolean
}


@Exclude()
export class Token extends BaseEntity
{
    @Expose() public hash: hashInterface = {
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
