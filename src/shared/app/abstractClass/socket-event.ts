import { IWSSerializer } from '@shared/classValidator/utils/ws-serializer';


export type SocketEventConfig = {
    to?: string;
    serializer?: IWSSerializer;
}

export abstract class SocketEvent<T = any>
{
    protected constructor(
        public readonly messageName: string,
        public readonly body?: T,
        public readonly config?: SocketEventConfig
    )
    {}
}
