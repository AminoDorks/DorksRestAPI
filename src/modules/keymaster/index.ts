import Elysia from "elysia";
import { CACHE, PINO } from "../../constants";
import { KeymasterModel } from "./model";
import { Keymaster } from "./service";

export const keymaster = new Elysia({ prefix: '/keymaster' })
    .onBeforeHandle(({ status, headers: { authorization } }) => {
        if (!authorization || !CACHE.includes(authorization)) {
            return status(403, KeymasterModel.forbidden.const);
        }
    })

    .get('/build-credentials/:userId', async ({ status, params }) => {
        const response = await Keymaster.buildCredentials(params);

        PINO.info({ status: response.status }, 'Built credentials');
        return status(response.status, response);
    }, {
        params: KeymasterModel.publicKeyParams,
        headers: KeymasterModel.headers,
        response: {
            200: KeymasterModel.buildCredentialsResponse,
            400: KeymasterModel.badRequestShape,
            403: KeymasterModel.forbidden
        }
    })

    .post('/sign', async ({ status, body }) => {
        const response = await Keymaster.signECDSA(body);

        PINO.info({ status: response.status }, 'Signed ECDSA');
        return status(response.status, response);
    }, {
        body: KeymasterModel.signECDSABody,
        headers: KeymasterModel.headers,
        response: {
            200: KeymasterModel.signECDSAResponse,
            400: KeymasterModel.badRequestShape,
            403: KeymasterModel.forbidden
        }
    });