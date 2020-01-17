const products = require('./products-memory');
const faker = require('faker');
module.exports =  (num)=>{

    const createRandomProduct = async () => {
        const key = faker.random.uuid();
        const name = faker.commerce.productName();
        const price = faker.commerce.price();
        const description = faker.commerce.product();
        const category = faker.commerce.productAdjective();
        const product = await products.create(key,name,price,description,category);
        return product;
    };

    [...Array(num)].map(()=> createRandomProduct())

    return products;
}
