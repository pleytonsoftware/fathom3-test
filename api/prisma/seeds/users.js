const { PrismaClient } = require("@prisma/client");
const { Crypter } = require("../../dist/helpers/crypter");
const { default: roles } = require("../../dist/@types/models/user/roles");
const { readJson } = require('./utils');

const prisma = new PrismaClient();

async function main() {
    const adminUserPassword = await Crypter.generatePassword("admin123");

    await prisma.user.upsert({
        where: { email: "admin@pleytonsoftware.com" },
        update: {},
        create: {
            email: "admin@pleytonsoftware.com",
            firstName: "Admin",
            password: adminUserPassword,
            role: roles.admin,
        },
    });

    const users = await readJson("users");

    for (const user of users) {
        const userPass = await Crypter.generatePassword(user.password);
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                password: userPass,
                role: roles.user,
            },
        });
    }
}

async function run() {
    try {
        await main()
        await prisma.$disconnect();
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    };
}

module.exports = run;