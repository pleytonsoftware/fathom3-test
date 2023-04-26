const runUsers = require("./users");
const runPosts = require("./posts");
const runComments = require("./comments");

async function run() {
    try {
        await runUsers();
        await runPosts();
        await runComments()
    } catch (e) {
        console.error(e);
        process.exit(1);
    };
}

run()
