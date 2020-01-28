const Product = require('./Product');
const sqlite3 = require('sqlite3');
const DBG = require('debug');
const debug = DBG('products:products-sqlite3');
const error = DBG('products:error-sqlite3');

let db; // DB Connection here

module.exports.connectDB = async function connectDB() {
    if (db) return db;
    const dbfile = process.env.SQLITE_FILE || 'db.sqlite3';
    await new Promise((resolve, reject) => {
        db = new sqlite3.Database(dbfile,
            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
            err => {
                if (err) return reject(err);
                resolve(db);
            });
    });
    return db;
}