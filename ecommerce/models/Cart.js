export class OCartrder {
    lines = new Map();
    constructor(initialLines) {
        if (initialLines) {
            initialLines.forEach(ol => this.lines.set(ol.product.id, ol));
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
            this.lines.set(prod.id, new OrderLine(prod, quantity));
        }
    }
    removeProduct(id) {
        this.lines.delete(id);
    }
    get orderLines() {
        return [...this.lines.values()];
    }
    get productCount() {
        return [...this.lines.values()]
            .reduce((total, ol) => total += ol.quantity, 0);
    }
    get total() {
        return [...this.lines.values()].reduce((total, ol) => total += ol.total, 0);
    }
}