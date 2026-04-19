import { Orders } from "../db/db.js";

export function saveOrder(order) {
    Orders.push(order);
}

export function getAllOrders() {
    return Orders;
}