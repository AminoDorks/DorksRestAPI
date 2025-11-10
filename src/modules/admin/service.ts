import { PRISMA } from "../../constants";
import { buildResponse, md5Hash } from "../../utils/utils";
import { AdminModel } from "./model";

export abstract class Admin {
    static async addUser({ userId, isActive }: AdminModel.AddUserBody) {
        if (await PRISMA.user.findFirst({ where: { id: userId } })) return AdminModel.alreadyExists.const;

        const user = await PRISMA.user.create({
            data: {
                id: userId,
                apiKey: md5Hash(userId),
                isActive
            }
        });
        return buildResponse(200, AdminModel.success.const, { user });
    };
};