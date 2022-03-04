const mysql = require('mysql');
const dbConfig = require('../config/dbConfig');

async function query(sql, resolve) {
  try {
    const db = await mysql.createConnection(dbConfig.db);
    db.connect();
    db.query(sql, resolve);
    db.end();
  } catch (e) {
    console.log(e);
  }
}

async function queryWithParams(sql, params, resolve) {
  try {
    const db = await mysql.createConnection(dbConfig.db);
    db.connect();
    db.query(sql, params, resolve);
    db.end();
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  query,
  queryWithParams
};
