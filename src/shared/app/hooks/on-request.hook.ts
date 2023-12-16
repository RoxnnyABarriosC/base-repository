import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export const onRequestHook = (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) =>
{
    reply['setHeader'] = function(key: string, value: any)
    {
        return this.raw.setHeader(key, value);
    };

    reply['end'] = function()
    {
        this.raw.end();
    };

    request['res'] = reply;

    done();
};
