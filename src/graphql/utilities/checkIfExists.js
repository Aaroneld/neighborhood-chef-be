const db = require('../../../data/dbConfig');

async function checkIfExists(params, table) {
    return (await db(table).where(params).first()) ? true : false;
}

module.exports = checkIfExists;
