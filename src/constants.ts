import { PrismaClient } from '@prisma/client';
import pino from 'pino';

export const CACHE: string[] = [];
export const REFRESH_INTERVAL = 1800000;

export const PRISMA = new PrismaClient();
export const ENCODER = new TextEncoder();

export const PINO = pino({
    transport: {
        target: 'pino-pretty'
    }
});