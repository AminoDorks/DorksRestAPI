import { randomBytes, createHash } from 'crypto';

export const md5Hash = (userId: string) => {
    const hash = createHash('md5');
    hash.update(userId + randomBytes(16).toString());

    return hash.digest('hex');
};

export const buildResponse = (status: number, message: string, payload: any = {}) => ({ timestamp: Date.now(), message, status, ...payload });