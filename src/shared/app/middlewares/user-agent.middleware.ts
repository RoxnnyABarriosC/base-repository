import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserAgent } from 'express-useragent';
import { FastifyReply, FastifyRequest } from 'fastify';

interface IUserAgentInfo {
    source: string;
    os: string;
    platform: string;
    browser: string;
    version: string;
}

declare global {
    interface Request {
        useragent: IUserAgentInfo;
    }

    interface Response {
        locals: {
            useragent: IUserAgentInfo;
        };
    }
}

@Injectable()
export class UserAgentMiddleware implements NestMiddleware
{
    use(req: FastifyRequest, res: FastifyReply, next: () => void)
    {
        const source = req.headers['user-agent'] ?? req.headers['x-ucbrowser-ua'] ?? 'unknown';

        const ua = new UserAgent();
        // @ts-ignore
        ua.Agent.source = source.replace(/^\s*/, '').replace(/\s*$/, '');
        ua.Agent.os = ua.getOS(ua.Agent.source);
        ua.Agent.platform = ua.getPlatform(ua.Agent.source);
        ua.Agent.browser = ua.getBrowser(ua.Agent.source);
        ua.Agent.version = ua.getBrowserVersion(ua.Agent.source);
        // @ts-ignore
        ua.testNginxGeoIP(req.headers);
        ua.testBot();
        ua.testMobile();
        ua.testAndroidTablet();
        ua.testTablet();
        ua.testCompatibilityMode();
        ua.testSilk();
        ua.testKindleFire();
        // @ts-ignore
        ua.testWechat();

        req['useragent'] = ua.Agent;
        next();
    }
}
