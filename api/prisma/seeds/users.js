const { PrismaClient } = require("@prisma/client");
const { Crypter } = require("../../dist/helpers/crypter");
const { default: roles } = require("../../dist/@types/models/user/roles");

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
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
