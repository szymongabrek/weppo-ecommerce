module.exports = class Product {
    #key;
    #name;
    #description;
    #price;
    #category;
    constructor({key, name, description, price, category}) { 
        this.#key = key; 
        this.#name = name; 
        this.#description = description; 
        this.#price = price; 
        this.#category = category; 

    } 

    get key() { return this.#key; }
    get name() { return this.#name; }
    set name(newName) { this.#name = newName; }
    get description() { return this.#description; }
    set description(newDesc) { this.#description = newDesc; }
    get price() { return this.#price; }
    set price(newPrice) { this.#price = newPrice; }
    get category() { return this.#category; }
    set category(newCategory) { this.#category = newCategory; }
};