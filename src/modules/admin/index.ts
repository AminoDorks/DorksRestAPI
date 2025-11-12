import Elysia from "elysia";

import { AdminModel } from "./model";
import { Admin } from "./service";

export const admin = new Elysia({ prefix: '/admin' })
    .onBeforeHandle(({ status, headers: { authorization } }) => {
        if (!authorization || authorization != process.env.ADMIN_TOKEN) {
            return status(403, AdminModel.forbidden.const);
        }
    })

    .post('/users/add', async ({ body }) => {
        const response = await Admin.addUser(body);

        return response;
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
        const response = await Admin.setStatus(params)

        return response;
    }, {
        params: AdminModel.setStatusParams,
        headers: AdminModel.headers,
        response: {
            200: AdminModel.userResponse,
            403: AdminModel.forbidden,
            404: AdminModel.notFound
        }
    })

    .get('/users/:userId', async ({ params }) => {
        const response = await Admin.getUser(params);

        return response;
    }, {
        params: AdminModel.getUserParams,
        headers: AdminModel.headers,
        response: {
            200: AdminModel.userResponse,
            403: AdminModel.forbidden,
            404: AdminModel.notFound
        }
    });