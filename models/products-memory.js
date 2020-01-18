const Product = require('./Product');
const {
    connectDB
} = require('./products-sqlite3')

const products = [];

export async function create(key, name, description, price, category) {
    const db = await connectDB();
    const product = new Product(key, name, description, price, category);
    await new Promise((resolve, reject) => {
        db.run("INSERT INTO products ( id, name, description, price, category) " +
            "VALUES ( ?, ? , ?, ?, ? );", [key, name, description, price, category], err => {
                if (err) return reject(err);
                resolve(product);
            });
    });
    return product;
}

export async function update(key, name, description, price, category) {
    const db = await connectDB();
    const product = new Product(key, name, description, price, category);
    await new Promise((resolve, reject) => {
        db.run(`UPDATE products
            SET name=?, description=?, price=?, category=?
            WHERE id=?;`, [key, name, description, price, category], err => {
            if (err) return reject(err);
            resolve(product);
        });
    });
    return product;
}

export async function read(key) {
    const db = await connectDB();
    const product = await new Promise((resolve, reject) => {
        db.run(`SELECT * FROM products
            WHERE id=?;`, [key], (err, row) => {
            if (err) return reject(err);
            const product = new Product(row.id, row.name, row.description, row.price, row.category);
            resolve(product);
        });
    });
    return product;
}

export async function destroy(key) {
    const db = await connectDB();
    return await new Promise((resolve, reject) => {
        db.run("DELETE FROM products WHERE id = ?;", [key], err => {
            if (err) return reject(err);
            resolve();
        });
    });
}

export async function keylist() {
    const db = await connectDB();
    const keyz = await new Promise((resolve, reject) => {
        const keyz = [];
        db.all("SELECT id FROM products", (err, rows) => {
            if (err) return reject(err);
            resolve(rows.map(row => row.id));
        });
    });
    return keyz;
}

export async function count() {
    const db = await connectDB();
    const count = await new Promise((resolve, reject) => {
        db.get("SELECT count(id) AS count FROM products",
            (err, row) => {
                if (err) return reject(err);
                resolve(row.count);
            });
    });
    return count;
}

export async function close() {
    const _db = db;
    db = undefined;
    return _db ? new Promise((resolve, reject) => {
            _db.close(err => {
                if (err) reject(err);
                else resolve();
            });
        }) : undefined;
}