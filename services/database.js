const oracledb = require("oracledb");
const dbConfig = require("../config/database.js");

async function initialize() {
  const pool = await oracledb.createPool(dbConfig.hrPool);
}

async function close() {
  await oracledb.getPool().close();
}

function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;

    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;

    try {
      conn = await oracledb.getConnection();

      const result = await conn.execute(statement, binds, opts);

      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}

module.exports.initialize = initialize;
module.exports.close = close;
module.exports.simpleExecute = simpleExecute;
