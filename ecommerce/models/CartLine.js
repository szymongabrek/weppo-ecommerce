module.exports = class CartLine {
    constructor( product, quantity) {
        // no statements required
    }
    get total() {
        return this.product.price * this.quantity;
    }
}