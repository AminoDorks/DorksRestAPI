import Elysia, { t } from "elysia";

import { ADMIN_HEADERS_SHAPE, API_MESSAGE_SHAPE } from "../../constants";
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
        headers: ADMIN_HEADERS_SHAPE,
        response: {
            200: t.Object({
                ...API_MESSAGE_SHAPE,
                user: AdminModel.userModel
            }),
            403: AdminModel.forbidden,
            409: AdminModel.alreadyExists
        }
    });