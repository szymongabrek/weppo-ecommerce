const products = require('./products-memory');
const faker = require('faker');
module.exports = (num) => {

    const createRandomProduct = async () => {
        const key = faker.random.number();
        const name = faker.commerce.productName();
        const price = faker.commerce.price();
        const description = faker.lorem.text();
        const category = faker.commerce.product();
        const product = await products.create(key,name,description,price,category);
        return product;
    };

    [...Array(num)].map(()=> createRandomProduct())

    return products;
}
