import { t } from 'elysia';

export namespace AdminModel {
    export const addUserBody = t.Object({
        userId: t.String({
            default: 'Telegram ID',
            description: 'ID of the user to be added'
        }),
        isActive: t.Boolean({ description: 'Subscription status' })
    });
    export const userModel = t.Object({
        id: t.String({
            description: 'User ID',
            default: 'Telegram ID'
        }),
        apiKey: t.String({
            description: 'User API key',
            default: 'API key'
        }),
        isActive: t.Boolean({ description: 'Subscription status' }),
        isBlocked: t.Boolean({ description: 'Block status' }),
    });
    export const forbidden = t.Literal('Forbidden. You need to be an admin.');
    export const alreadyExists = t.Literal('User already exists.');
    export const success = t.Literal('Success.');

    export type AddUserBody = typeof addUserBody.static;
    export type User = typeof userModel.static;
    export type forbidden = typeof forbidden.static;
    export type alreadyExists = typeof alreadyExists.static;
    export type success = typeof success.static;
};
