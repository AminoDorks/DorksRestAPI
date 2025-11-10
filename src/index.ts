import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { config } from 'dotenv';

import { PINO } from './constants';
import { connectAdb, loadFridaAgent } from './utils/fridaWrapper';
import { refreshData } from './utils/refresh';
import { admin } from './modules/admin';

config({ path: '../.env', quiet: true });

(async () => {
    await connectAdb();
    await loadFridaAgent();
    await Promise.all([refreshData()]);

    const app = new Elysia({ prefix: '/api/v2', normalize: true })
        .use(openapi({
            path: '/docs',
            documentation: {
                info: {
                    title: 'Dorks REST API',
                    version: '1.0.0',
                    description: 'REST API for bypassing Google Play Integrity and Keystore vulnerabilities'
                }
            }
        }))
        .use(admin)
        .listen(process.env.PORT || 3000);

    PINO.info({ hostname: app.server?.hostname, port: app.server?.port }, `Server started`);
})();