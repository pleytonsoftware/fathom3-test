const { PrismaClient } = require("@prisma/client");
const { readJson } = require('./utils');

const prisma = new PrismaClient();

async function main() {
    const comments = await readJson("comments");

    for (const comment of comments) {
        await prisma.comment.upsert({
            where: { id: comment.id },
            update: {},
            create: {
                content: comment.content,
                authorId: comment.authorId,
                postId: comment.postId
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