'use strict';

const faker = require('faker');
const createRandomProducts = (num) => {
    return [...Array(num)].map(()=> createRandomProduct());
}

const createRandomProduct = () => {
  const name = faker.commerce.productName();
  const price = faker.commerce.price();
  const description = faker.lorem.text();
  const category = faker.commerce.product();
  const createdAt = new Date().toDateString();
  const updatedAt = new Date().toDateString()
  return { name, price, description, category, createdAt, updatedAt };
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', createRandomProducts(10), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};