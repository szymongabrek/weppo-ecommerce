export class Cart {
    lines = new Map();
    constructor(initialLines) {
        if (initialLines) {
            initialLines.forEach(cl => this.lines.set(cl.product.id, cl));
        }
    }
    addProduct(prod, quantity) {
        if (this.lines.has(prod.id)) {
            if (quantity === 0) {
                this.removeProduct(prod.id);
            } else {
                this.lines.get(prod.id).quantity += quantity;
            }
        } else {
            this.lines.set(prod.id, new CartLine(prod, quantity));
        }
    }
    removeProduct(id) {
        this.lines.delete(id);
    }
    get cartLines() {
        return [...this.lines.values()];
    }
    get productCount() {
        return [...this.lines.values()]
            .reduce((total, cl) => total += cl.quantity, 0);
    }
    get total() {
        return [...this.lines.values()].reduce((total, cl) => total += cl.total, 0);
    }
}