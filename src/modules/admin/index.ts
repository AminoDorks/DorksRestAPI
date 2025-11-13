import Elysia from "elysia";

import { AdminModel } from "./model";
import { Admin } from "./service";

export const admin = new Elysia({ prefix: '/admin' })
    .onBeforeHandle(({ status, headers: { authorization } }) => {
        if (!authorization || authorization != process.env.ADMIN_TOKEN) {
            return status(403, AdminModel.forbidden.const);
        }
    })

    .get('/users/:userId', async ({ params }) => {
        return await Admin.getUser(params);
    }, {
        params: AdminModel.getUserParams,
        headers: AdminModel.headers,
        response: {
            200: AdminModel.userResponse,
            403: AdminModel.forbidden,
            404: AdminModel.notFound
        }
    })

    .post('/users/add', async ({ body }) => {
        return await Admin.addUser(body);
    }, {
        body: AdminModel.addUserBody,
        headers: AdminModel.headers,
        response: {
            200: AdminModel.userResponse,
            403: AdminModel.forbidden,
            409: AdminModel.alreadyExists
        }
    })

    .post('/users/status/:userId/:isActive', async ({ params }) => {
        return await Admin.setStatus(params);
    }, {
        params: AdminModel.setStatusParams,
        headers: AdminModel.headers,
        response: {
            200: AdminModel.userResponse,
            403: AdminModel.forbidden,
            404: AdminModel.notFound
        }
    });