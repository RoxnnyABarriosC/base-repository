import { IMyStore } from '@modules/common/store';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FastifyReply } from 'fastify';
import { ClsService } from 'nestjs-cls';
import { Agent } from '../decorators';
dayjs.extend(utc);

interface Props {
    res: FastifyReply;
    agent: Agent;
    configService: ConfigService;
    store: ClsService<IMyStore>;
    refreshHash?: string;
    expiresRefresh?: number;
}

/**
 * This function sends a refresh token to the client by setting a cookie or adding metadata to the response.
 * @param {object} props - An object containing the properties for sending the refresh token.
 * @param {FastifyReply} props.res - The Fastify reply object.
 * @param {Agent} props.agent - The agent object containing information about the client.
 * @param {ClsService<IMyStore>} props.store - The ClsService store object.
 * @param {ConfigService} props.configService - The ConfigService object for accessing configuration values.
 * @param {string} [props.refreshHash=null] - The refresh token hash to be sent.
 * @param {number} [props.expiresRefresh=0] - The expiration time of the refresh token in seconds since the Unix epoch.
 */
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
                path: `${configService.getOrThrow('server.prefix')}${configService.getOrThrow('server.version')}/auth`,
                secure: configService.getOrThrow('setCookieSecure'),
                httpOnly: true,
                sameSite: configService.getOrThrow('setCookieSameSite')
            });
    }

    store.set('res.metadata',  agent.isMobile || agent.isMobileNative ? { refreshToken: refreshHash } :  undefined);
};
