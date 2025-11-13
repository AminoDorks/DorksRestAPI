import { t } from 'elysia';
import { API_MESSAGE_SHAPE } from '../../constants';

export namespace AdminModel {
    export const headers = t.Object({
        authorization: t.String({
            description: 'Special admin token',
            default: 'ADMIN_TOKEN'
        })
    });

    export const addUserBody = t.Object({
        userId: t.String({
            default: 'Telegram ID',
            description: 'ID of the user to be added'
        }),
        isActive: t.Boolean({ description: 'Subscription status' })
    });
    export const setStatusParams = t.Object({
        userId: t.String({
            default: ':userId',
            description: 'ID of the user to be modified'
        }),
        isActive: t.Boolean({
            default: ':isActive',
            description: 'Subscription status'
        })
    })
    export const getUserParams = t.Object({
        userId: t.String({
            default: ':userId',
            description: 'ID of the user to be modified'
        })
    });
    
    export const userResponse = t.Object({
        ...API_MESSAGE_SHAPE,
        user: t.Object({
            id: t.String({
                description: 'User ID',
                default: 'Telegram ID'
            }),
            apiKey: t.String({
                description: 'User API key',
                default: 'API key'
            }),
            isActive: t.Boolean({ description: 'Subscription status' }),
            isBlocked: t.Boolean({ description: 'Block status' })
        })
    });

    export const forbidden = t.Literal('Forbidden. You need to be an admin.');
    export const alreadyExists = t.Literal('User already exists.');
    export const notFound = t.Literal('User not found.');

    export type addUserBody = typeof addUserBody.static;
    export type setStatusParams = typeof setStatusParams.static;
    export type getUserParams = typeof getUserParams.static;
    export type userResponse = typeof userResponse.static;
    export type forbidden = typeof forbidden.static;
    export type alreadyExists = typeof alreadyExists.static;
    export type notFound = typeof notFound.static;
};
