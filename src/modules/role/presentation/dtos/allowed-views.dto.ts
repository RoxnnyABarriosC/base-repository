import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AllowedViewsDto
{
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    public readonly allowedViews: string[];
}
