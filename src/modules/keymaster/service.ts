import { validate } from "uuid";
import { PINO, success } from "../../constants";
import { createKeyPair, getCertificateChain, hasAlias, signECDSA } from "../../utils/fridaWrapper";
import { buildResponse } from "../../utils/utils";
import { KeymasterModel } from "./model";

export abstract class Keymaster {
    static async signECDSA({ userId, payload }: KeymasterModel.signECDSABody) {
        try {
            const ecdsa = await signECDSA(payload, userId);
            if (!ecdsa) {
                PINO.error('Failed to sign ECDSA');
                return buildResponse(400, KeymasterModel.badRequest.const, { error: 'Failed to sign ECDSA' });
            }

            return buildResponse(200, success.const, { ecdsa });
        } catch (e) {
            PINO.error({ error: (e as Error).message }, 'Failed to sign ECDSA');
            return buildResponse(400, KeymasterModel.badRequest.const, { error: (e as Error).message });
        };
    };

    static async buildCredentials({ userId }: KeymasterModel.publicKeyParams) {
        if (!validate(userId)) return buildResponse(400, KeymasterModel.badRequest.const, { error: `Invalid userId: ${userId}` });
        if (!await hasAlias(userId)) await createKeyPair(userId);

        try {
            const key_chain = await getCertificateChain(userId);
            if (!key_chain) {
                PINO.error('Failed to get certificate chain');
                return buildResponse(400, KeymasterModel.badRequest.const, { error: 'Failed to get certificate chain' });
            }

            return buildResponse(200, success.const, {
                credentials: {
                    key_chain,
                    token: process.env.PLAY_INTEGRITY_TOKEN,
                    timestamp: Date.now(),
                    uid: userId
                }
            });
        } catch (e) {
            PINO.error({ error: (e as Error).message }, 'Failed to build credentials');
            return buildResponse(400, KeymasterModel.badRequest.const, { error: (e as Error).message });
        };
    };
};