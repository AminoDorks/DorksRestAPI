import { PrismaClient } from '@prisma/client';
import { t } from 'elysia';
import pino from 'pino';

export const CACHE: string[] = [];
export const REFRESH_INTERVAL = 1800000;

export const PRISMA = new PrismaClient();
export const ENCODER = new TextEncoder();

export const API_MESSAGE_SHAPE = {
    timestamp: t.Number({
        description: 'Timestamp in milliseconds',
        default: Date.now()
    }),
    message: t.String({
        description: 'General server response',
        default: 'Success.'
    }),
    status: t.Number({
        description: 'HTTP status code',
        default: 200
    }),
};

export const ADMIN_HEADERS_SHAPE = t.Object({
    authorization: t.String({
        description: 'Special admin token',
        default: 'ADMIN_TOKEN'
    })
})

export const PINO = pino({
    transport: {
        target: 'pino-pretty'
    }
});