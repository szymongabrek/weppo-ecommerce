const Product = require('../models/Product');
const faker = require('faker');

function generateRandomProduct() {
    const name = faker.commerce.productName();
    const price = faker.commerce.price();
    const description = faker.lorem.text();
    const category = faker.commerce.product();
    return { name, price, description, category };
};

async function clearDB() {
    await Product.destroy({ where: {}});
}

async function populateDB() {
    const n = 10;
    for (let i = 0; i < n; i++){
        await Product.create(generateRandomProduct());
    }
}

function seedDB() {
    clearDB();
    populateDB();
}

seedDB();
