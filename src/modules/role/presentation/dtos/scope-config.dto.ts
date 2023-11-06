import { IsNotEmpty, IsObject } from 'class-validator';

export class ScopeConfigDto
{
    @IsNotEmpty()
    @IsObject()
    public readonly scopeConfig: object;
}
