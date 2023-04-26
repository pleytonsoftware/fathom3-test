async function readJson(filename) {
    const fs = require('fs');
    const path = require("path");

    const jsonPath = path.join(__dirname, 'json');
    return JSON.parse(await fs.promises.readFile(path.join(jsonPath, `${filename}.json`)));
}

module.exports = {
    readJson
};