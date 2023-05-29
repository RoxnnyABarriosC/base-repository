import { ValidationError } from 'class-validator';
import _ from 'lodash';

export class ErrorModel
{
    public readonly property: string;
    public readonly constraints: Record<string, any>;
    public readonly children: ErrorModel[];

    constructor(errors: ValidationError)
    {
        this.property = errors.property;
        this.constraints = errors.constraints;

        if (!_.isEmpty(errors.children))
        {
            this.children = [];
            errors.children.forEach(_children => this.children.push(new ErrorModel(_children)));
        }
    }
}
