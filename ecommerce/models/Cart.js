const CartLine = require('./CartLine');

module.exports = class Cart {
    lines = new Map();
    constructor(initialLines) {
        if (initialLines) {
            initialLines.forEach(cl => this.lines.set(cl.product.key, cl));
        }
    }
    addProduct(prod, quantity) {
        if (this.lines.has(prod.key)) {
            if (quantity === 0) {
                this.removeProduct(prod.key);
            } else {
                this.lines.get(prod.key).quantity += quantity;
            }
        } else {
            this.lines.set(prod.key, new CartLine(prod, quantity));
        }
    }
    removeProduct(key) {
        this.lines.delete(key);
    }
    get cartLines() {
        return [...this.lines.values()];
    }
    get productCount() {
        return [...this.lines.values()]
            .reduce((total, cl) => total += cl.quantity(), 0);
    }
    get total() {
        return [...this.lines.values()].reduce((total, cl) => total += cl.total, 0);
    }
}