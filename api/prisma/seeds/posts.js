const { PrismaClient } = require("@prisma/client");
const { readJson } = require('./utils');

const prisma = new PrismaClient();

async function main() {
    const posts = await readJson("posts");

    for (const post of posts) {
        await prisma.post.upsert({
            where: { id: post.id },
            update: {},
            create: {
                title: post.title,
                image: post.image,
                content: post.content,
                publishedAt: new Date(post.publishedAt),
                authorId: post.authorId
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