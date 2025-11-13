import { t } from "elysia";
import { API_MESSAGE_SHAPE } from "../../constants";

export namespace KeymasterModel {
    export const headers = t.Object({
        authorization: t.String({
            description: 'Special API key that you can get from t.me/aminodorks_bot',
            default: 'API_KEY'
        })
    });
    
    export const publicKeyParams = t.Object({
        userId: t.String({
            default: ':userId',
            description: 'AminoApps user ID as alias in KeyStore'
        })
    });
    export const signECDSABody = t.Object({
        userId: t.String({
            default: 'xxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
            description: 'AminoApps user ID as alias in KeyStore'
        }),
        payload: t.String({
            default: '{"facts": "aminodorks is the best developers team"}',
            description: 'Data to be signed'
        })
    });

    export const signECDSAResponse = t.Object({
        ...API_MESSAGE_SHAPE,
        ecdsa: t.String({
            default: 'MEQCIHnAZTTY7Oicg7PVsZ0ucPQtiPIClB032wvpDT+eadJCAiBVk7om2EaXjh1nGW01E2fphUSQXM8+8XvTvBRQVvODtA==',
            description: 'ECDSA signature'
        })
    });
    export const buildCredentialsResponse = t.Object({
        ...API_MESSAGE_SHAPE,
        credentials: t.Object({
            key_chain: t.Array(t.String(), {
                description: 'KeyStore certificate chain in PEM format',
                default: [
                    '-----BEGIN CERTIFICATE-----BLAHBLAH\n-----END CERTIFICATE-----',
                    '-----BEGIN CERTIFICATE-----Another BLAHBLAH\n-----END CERTIFICATE-----',
                    '-----BEGIN CERTIFICATE-----BLAHBLAH\n-----END CERTIFICATE-----',
                    '-----BEGIN CERTIFICATE-----BLAHBLAH\n-----END CERTIFICATE-----'
                ]
            }),
            token: t.String({
                description: 'Play Integrity Token in JWT format',
                default: 'eyJraWQiOiJVTjJhMmciLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ...'
            }),
            timestamp: t.Number({
                description: 'Timestamp in milliseconds',
                default: Date.now()
            }),
            uid: t.String({
                description: 'AminoApps user ID as alias in KeyStore',
                default: 'xxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx'
            })
        })
    })
    export const badRequestShape = t.Object({
        error: t.String({
            description: 'Error message'
        }),
        status: t.Number({
            description: 'HTTP status code',
            default: 400
        }),
        timestamp: t.Number({
            description: 'Timestamp in milliseconds',
            default: Date.now()
        }),
        message: t.String({
            description: 'General server response',
            default: 'Bad request.'
        }),
    });
    export const badRequest = t.Literal('Bad request.');
    export const forbidden = t.Literal('Forbidden. Your API key is invalid.');
    
    export type publicKeyParams = typeof publicKeyParams.static;
    export type signECDSABody = typeof signECDSABody.static;
    export type headers = typeof headers.static;
    export type signECDSAResponse = typeof signECDSAResponse.static;
    export type buildCredentialsResponse = typeof buildCredentialsResponse.static;
    export type badRequestShape = typeof badRequestShape.static;
    export type badRequest = typeof badRequest.static;
    export type forbidden = typeof forbidden.static;
}