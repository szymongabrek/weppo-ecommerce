const _product_key = Symbol('key');
const _product_name = Symbol('name');
const _product_description = Symbol('description');
const _product_price = Symbol('price');
const _product_category = Symbol('category');


module.exports = class Product { 
    constructor(key, name, description, price, category) { 
        this[_product_key] = key; 
        this[_product_name] = name; 
        this[_product_description] = description; 
        this[_product_price] = price; 
        this[_product_category] = category; 

    } 

    get key() { return this[_product_key]; }
    get name() { return this[_product_name]; }
    set name(newName) { this[_product_name] = newName; }
    get description() { return this[_product_description]; }
    set description(newDesc) { this[_product_description] = newDesc; }
    get price() { return this[_product_price]; }
    set price(newPrice) { this[_product_price] = newPrice; }
    get category() { return this[_product_category]; }
    set category(newCategory) { this[_product_category] = newCategory; }
};