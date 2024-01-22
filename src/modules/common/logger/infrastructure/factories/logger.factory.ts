import { ConfigService } from '@nestjs/config';
import { CORRELATION_ID_HEADER, REAL_IP } from '@shared/app/constants';
import { CreateFileStream } from '@shared/utils';
import { blue, cyan, green, yellow } from 'colorette';
import { Params } from 'nestjs-pino';
import pino from 'pino';
import PinoPretty from 'pino-pretty';

export const loggerFactory = async(configService: ConfigService): Promise<Params> =>
{
    const colorize = configService.get<boolean>('logger.colorize');

    const streams = [
        {
            stream: CreateFileStream({
                fileName: 'trace',
                path: '.logs',
                extension: '.log'
            })
        },
        {
            stream: PinoPretty({
                colorize,
                colorizeObjects: colorize,
                translateTime: 'yyyy/mm/dd\' T\'HH:MM:ss.l\'Z\'',
                messageFormat: '{correlationId}:[{realIp}] [{context}] {msg}',
                ignore: 'context,res,req,correlationId,realIp',
                errorLikeObjectKeys: ['err', 'error'],
                singleLine: configService.getOrThrow('logger.singleLine'),
                customPrettifiers: {
                    time: timestamp => blue(`🕰 ${timestamp}`),
                    hostname: hostname => green(hostname as any),
                    pid: pid => yellow(pid as any),
                    name: name => blue(name as any),
                    caller: caller => cyan(caller as any)
                }
            })
        }
    ];

    return {
        pinoHttp: {
            autoLogging: false,
            customProps(req)
            {
                return {
                    correlationId: req[CORRELATION_ID_HEADER],
                    realIp: req[REAL_IP]
                };
            },
            stream: pino.multistream(streams)

        },
        exclude: configService.getOrThrow('logger.exclude')
    } as Params;
};
