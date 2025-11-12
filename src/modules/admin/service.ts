import { CACHE, PRISMA } from "../../constants";
import { buildResponse, md5Hash } from "../../utils/utils";
import { AdminModel } from "./model";

export abstract class Admin {
    static async addUser({ userId, isActive }: AdminModel.addUserBody) {
        if (await PRISMA.user.findFirst({ where: { id: userId } })) return AdminModel.alreadyExists.const;

        const user = await PRISMA.user.create({
            data: {
                id: userId,
                apiKey: md5Hash(userId),
                isActive
            }
        });
        CACHE.push(user.apiKey);
        return buildResponse(200, AdminModel.success.const, { user });
    };

    static async setStatus({ userId, isActive }: AdminModel.setStatusParams) {
        if (!await PRISMA.user.findFirst({ where: { id: userId } })) return AdminModel.notFound.const;

        const user = await PRISMA.user.update({
            where: { id: userId },
            data: { isActive }
        });
        user.isActive ? CACHE.push(user.apiKey) : CACHE.splice(CACHE.indexOf(user.apiKey), 1);
        return buildResponse(200, AdminModel.success.const, { user });
    };

    static async getUser({ userId }: AdminModel.getUserParams) {
        const user = await PRISMA.user.findFirst({ where: { id: userId } });
        if (!user) return AdminModel.notFound.const;

        return buildResponse(200, AdminModel.success.const, { user });
    };
};