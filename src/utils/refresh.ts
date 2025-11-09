import { PRISMA, CACHE, REFRESH_INTERVAL, PINO } from '../constants'
import { sendPlayIntegrityToken } from './fridaWrapper';

export const refreshData = async () => {
    try {
        await sendPlayIntegrityToken();
        const allUsers = await PRISMA.user.findMany({ where: { isActive: true, isBlocked: false } });

        CACHE.length = 0;
        CACHE.push(...allUsers.map(user => user.apiKey));
    } catch (error) {
        PINO.error(error, 'Failed to refresh data');
    } finally {
        setTimeout(refreshData, REFRESH_INTERVAL);
    };
};
