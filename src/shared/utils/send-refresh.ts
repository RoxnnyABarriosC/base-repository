import { MyStore } from '@modules/common/store';
import { ConfigService } from '@nestjs/config';
import { Agent } from '@shared/decorators';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FastifyReply } from 'fastify';
import { ClsService } from 'nestjs-cls';
dayjs.extend(utc);

interface Props {
    res: FastifyReply;
    agent: Agent;
    configService: ConfigService;
    store: ClsService<MyStore>;
    refreshHash?: string;
    expiresRefresh?: number;
}

export const SendRefresh = ({
    res,
    agent,
    store,
    configService,
    refreshHash = null,
    expiresRefresh = 0
}: Props): void  =>
{
    if (!agent.isMobile || !agent.isMobileNative)
    {
        res.setCookie(
            'refreshToken',
            refreshHash,
            {
                expires: dayjs.unix(expiresRefresh).utc().toDate(),
                path: `${configService.get('server.prefix')}${configService.get('server.version')}/auth`,
                secure: configService.get('setCookieSecure'),
                httpOnly: true,
                sameSite: configService.get('setCookieSameSite')
            });
    }

    store.set('res.metadata',  agent.isMobile || agent.isMobileNative ? { refreshToken: refreshHash } :  undefined);
};
