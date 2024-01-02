import { ModuleRef } from '@nestjs/core';

export type PolicyType = { new(): Policy }

export abstract class Policy
{
    abstract handle<T = any>(request: T | any, module: ModuleRef): Promise<void>
}
