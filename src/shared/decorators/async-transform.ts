import { Abstract, DynamicModule, INestApplicationContext, Type } from '@nestjs/common';
import { ContextId } from '@nestjs/core';
import { ClassConstructor, ClassTransformOptions, TransformFnParams, TransformOptions, TransformationType, plainToClass } from 'class-transformer';

export interface ITransformer
{
    transform(params: TransformFnParams): Promise<unknown>;
}

export interface ITransformerFunction
{
    (params: AsyncTransformerParams): Promise<unknown>;
}

export interface ITransformerResolver
{
    resolveTransformer(options: TransformerResolverOptions): Promise<ITransformer>;
}

export type TransformerResolverOptions = {
    strict: boolean;
    scoped: boolean;
    contextId?: ContextId;
    token: ResolvedTransformerToken;
};

export type BaseTransformOptions = TransformOptions & {
    select?: Type<any> | DynamicModule;
    strict?: boolean;
    scoped?: boolean;
};

export type AsyncTransformWithOptions = BaseTransformOptions & {
    token?: TransformerToken;
};

export type AsyncTransformOptions = BaseTransformOptions & {
    body?: ITransformerFunction;
};

export type AnyTransformOptions = AsyncTransformOptions | AsyncTransformWithOptions;

export type AsyncTransformerParams = Omit<TransformFnParams, 'options'> & {
    options: AnyTransformOptions;
};

export type TransformEntry = {
    propertyKey: string | symbol;
    options: AnyTransformOptions;
};

type Token<T> = string | symbol | Type<T> | Abstract<T>;
type AbstractTransformerType = Abstract<ITransformer>;
type TransformerType = Type<ITransformer>;
type TransformerToken = string | symbol | (() => AbstractTransformerType | TransformerType);
type ResolvedTransformerToken = string | symbol | AbstractTransformerType | TransformerType;

const TRANSFORM_ENTRIES = Symbol('TRANSFORM_ENTRIES');

class TransformContext implements ITransformerResolver
{
    public appContext: INestApplicationContext;
    public appContextId: ContextId | undefined;
    public resolverToken: Token<ITransformerResolver> | undefined;

    async _initialize(appContext: INestApplicationContext, appContextId: ContextId | undefined, resolverToken: Token<ITransformerResolver> | undefined): Promise<void>
    {
        if (this.appContext)
        {
            throw new Error('The InjectedTransform mechanism was already initialized.');
        }

        this.appContext = appContext;
        this.appContextId = appContextId;
        this.resolverToken = resolverToken;
    }

    _ensureInitialized()
    {
        if (!this.appContext)
        {
            throw new Error('Async Transform context was not initialized yet.');
        }
    }

    async getTransformer(options: AsyncTransformWithOptions): Promise<ITransformer>
    {
        const resolvedOptions = this.resolveOptions(options);
        const { nestContext, strict, token } = resolvedOptions;
        const resolver = this.resolverToken ? nestContext.get(this.resolverToken, { strict }) : this;
        const instance = await resolver.resolveTransformer(resolvedOptions);

        if (!instance)
        {
            const transformerName = typeof token === 'function' ? token.name : String(token);
            throw new Error(`No instance for transformer of type ${transformerName} was created, or \`useContainer\` was not called yet.`);
        }

        return instance;
    }

    async resolveTransformer(
        options: TransformerResolverOptions & {
            nestContext: INestApplicationContext;
        }
    ): Promise<ITransformer>
    {
        const { nestContext, strict, contextId, scoped, token } = options;

        if (scoped)
        {
            return nestContext.resolve(token, contextId, { strict });
        }

        return nestContext.get(token, { strict });
    }

    addTransformEntry<T>(type: Type<T> | Abstract<T>, options: TransformEntry): void
    {
        if (typeof type === 'function' && 'prototype' in type)
        {
            type = type.prototype;
        }

        const constructor = type.constructor;
        const entries: TransformEntry[] = Reflect.getMetadata(TRANSFORM_ENTRIES, constructor) || [];
        entries.push(options);
        Reflect.defineMetadata(TRANSFORM_ENTRIES, entries, constructor);
    }

    listTransformEntries<T>(type: Type<T> | Abstract<T>): TransformEntry[]
    {
        if (typeof type === 'function' && 'prototype' in type)
        {
            type = type.prototype;
        }

        const constructor = type.constructor;
        return Reflect.getMetadata(TRANSFORM_ENTRIES, constructor) || [];
    }

    private resolveOptions(options: AsyncTransformWithOptions): TransformerResolverOptions & { nestContext: INestApplicationContext }
    {
        const { select } = options;
        let nestContext = this.appContext;

        if (select)
        {
            nestContext = this.appContext.select(select);
        }

        const strict = options.strict ?? !!module;
        const scoped = options.scoped ?? false;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const token = resolveToken(options.token);

        return { strict, scoped, token, nestContext };
    }
}

let context: TransformContext;

function getContext(): TransformContext
{
    if (!context)
    {
        context = new TransformContext();
    }
    return context;
}

function getInitializedContext(): TransformContext
{
    const ctx = getContext();
    ctx._ensureInitialized();
    return ctx;
}

function resolveToken(token: TransformerToken): ResolvedTransformerToken
{
    return typeof token === 'function' ? token() : token;
}

export interface IUseContainerOptions
{
    contextId?: ContextId;
    resolver?: Token<ITransformerResolver>;
}

export async function useContainer(_appContext: INestApplicationContext, options: IUseContainerOptions = {}): Promise<void>
{
    getContext()._initialize(_appContext, options.contextId, options.resolver);
}

export function AsyncTransform(fn: ITransformerFunction, options?: AsyncTransformOptions): PropertyDecorator;
// eslint-disable-next-line no-redeclare
export function AsyncTransform(options: AsyncTransformOptions & { body: TransformerToken }): PropertyDecorator;
// eslint-disable-next-line no-redeclare
export function AsyncTransform(_body: ITransformerFunction | (AsyncTransformOptions & { body: TransformerToken }), _options: AsyncTransformOptions = {}): PropertyDecorator
{
    let options = _options;

    if (typeof _body === 'function')
    {
        options.body = _body;
    }
    else
    {
        options = _body;
    }

    return (type: any, propertyKey) =>
    {
        getContext().addTransformEntry(type, { propertyKey, options });
    };
}

export function AsyncTransformWith(useClass: TransformerToken, options?: AsyncTransformWithOptions): PropertyDecorator;
// eslint-disable-next-line no-redeclare
export function AsyncTransformWith(options: AsyncTransformWithOptions & { token: TransformerToken }): PropertyDecorator;
// eslint-disable-next-line no-redeclare
export function AsyncTransformWith(_token: TransformerToken | (AsyncTransformWithOptions & { token: TransformerToken }), _options: AsyncTransformWithOptions = {}): PropertyDecorator
{
    let options = _options;

    if (typeof _token === 'string' || typeof _token === 'symbol' || typeof _token === 'function')
    {
        options = { ..._options, token: _token };
    }
    else
    {
        options = _token;
    }

    return (type: any, propertyKey) =>
    {
        getContext().addTransformEntry(type, { propertyKey, options });
    };
}

export function asyncPlainToClass<T, V>(type: ClassConstructor<T>, plain: V[], options?: ClassTransformOptions): Promise<T[]>;
// eslint-disable-next-line no-redeclare
export function asyncPlainToClass<T, V>(type: ClassConstructor<T>, plain: V, options?: ClassTransformOptions): Promise<T>;
// eslint-disable-next-line no-redeclare
export async function asyncPlainToClass<T, V>(type: ClassConstructor<T>, plains: V[] | V, callOptions: ClassTransformOptions = {}): Promise<T[] | T>
{
    const entries = getContext().listTransformEntries(type);
    for (const entry of entries)
    {
        const { propertyKey, options: decoratorOptions } = entry;
        const options: AnyTransformOptions = {
            ...callOptions,
            ...decoratorOptions
        };

        const postTransform = async(transformed: T): Promise<T> =>
        {
            const value = transformed[propertyKey];
            const key = String(propertyKey);
            const obj = transformed;
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const type = TransformationType.PLAIN_TO_CLASS;
            let propValue: unknown;

            if ('body' in decoratorOptions)
            {
                propValue = await decoratorOptions.body({
                    value,
                    key,
                    obj,
                    type,
                    options
                });
            }
            else if ('token' in decoratorOptions)
            {
                const transformer = await getInitializedContext().getTransformer(decoratorOptions);
                propValue = await transformer.transform({
                    value,
                    key,
                    obj,
                    type,
                    options
                });
            }
            else
            {
                // should never happen, tho
                throw new Error('Invalid transform configuration');
            }

            transformed[propertyKey] = propValue;
            return transformed;
        };

        if (Array.isArray(plains))
        {
            const transformed = plainToClass(type, plains, callOptions);
            return await Promise.all(transformed.map(postTransform));
        }

        const transformed = plainToClass(type, plains, callOptions);
        return await postTransform(transformed);
    }
}
