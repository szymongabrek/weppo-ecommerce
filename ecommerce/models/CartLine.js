module.exports = class CartLine {
    constructor( product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }
    get total() {
        return this.product.price() * this.quantity;
    }
}