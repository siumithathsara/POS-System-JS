import {
    saveOrder,
    getAllOrders
} from "../model/orderModel.js";

import { getAllCustomers } from "../model/customerModel.js";
import { getAllItems, updateItem } from "../model/itemModel.js";

$(document).ready(function () {
    init();
});

let cart = [];

function init() {
    refresh();
    bindEvents();
}

function bindEvents() {

    $("#orderCustomerId").on("change", searchCustomer);
    $("#orderItemCode").on("change", searchItem);

    $("#addItemBtn").on("click", addToCart);
    $("#purchaseBtn").on("click", purchaseOrder);

    $("#discount, #cash").on("keyup", calculateTotals);

    $("#orderTableBody").on("click", ".removeBtn", removeCartItem);
}

function refresh() {

    generateOrderId();

    $("#orderDate").val(new Date().toISOString().split("T")[0]);

    loadCustomerIds();
    loadItemCodes();

    clearFields();

    cart = [];
    loadCartTable();
    calculateTotals();
}

function loadCustomerIds() {

    $("#orderCustomerId").empty();

    $("#orderCustomerId").append(`<option value="">Select ID</option>`);

    getAllCustomers().forEach(c => {
        $("#orderCustomerId").append(`
            <option value="${c.cusId}">
                ${c.cusId}
            </option>
        `);
    });
}

function loadItemCodes() {

    $("#orderItemCode").empty();

    $("#orderItemCode").append(`<option value="">Select Code</option>`);

    getAllItems().forEach(i => {
        $("#orderItemCode").append(`
            <option value="${i.itemId}">
                ${i.itemId}
            </option>
        `);
    });
}


function searchCustomer() {

    let id = $("#orderCustomerId").val();

    let c = getAllCustomers().find(x => x.cusId === id);

    if (!c) return;

    $("#orderCustomerName").val(c.cusName);
    $("#orderCustomerSalary").val(c.cusSalary);
    $("#orderCustomerAddress").val(c.cusAddress);
}


function searchItem() {

    let code = $("#orderItemCode").val();

    let i = getAllItems().find(x => x.itemId === code);

    if (!i) return;

    $("#orderItemName").val(i.itemName);
    $("#orderItemPrice").val(i.itemPrice);
    $("#orderQtyOnHand").val(i.itemQty);
}


function addToCart() {

    let code = $("#orderItemCode").val();
    let qty = parseInt($("#orderQty").val());

    let item = getAllItems().find(i => i.itemId === code);

    if (!item) return alert("Select Item");

    if (qty > item.itemQty) return alert("No Stock");

    let total = qty * item.itemPrice;

    cart.push({
        itemId: item.itemId,
        itemName: item.itemName,
        price: item.itemPrice,
        qty: qty,
        total: total
    });

    loadCartTable();
    calculateTotals();
    clearItemFields();
}


function loadCartTable() {

    $("#orderTableBody").empty();

    cart.forEach((i, index) => {

        $("#orderTableBody").append(`
        <tr>
            <td>${i.itemId}</td>
            <td>${i.itemName}</td>
            <td>${i.price.toFixed(2)}</td>
            <td>${i.qty}</td>
            <td>${i.total.toFixed(2)}</td>
            <td>
            <button class="removeBtn btn btn-danger btn-sm"
            data-index="${index}">
            Remove
            </button>
            </td>
        </tr>
        `);

    });
}


function removeCartItem() {

    let index = $(this).data("index");

    cart.splice(index, 1);

    loadCartTable();
    calculateTotals();
}


function calculateTotals() {

    let total = 0;

    cart.forEach(i => total += i.total);

    let discountInput = $("#discount").val().trim();

    let discount = 0;

    if (discountInput.includes("%")) {

        let percent = parseFloat(discountInput);

        discount = total * percent / 100;

    } else {

        discount = parseFloat(discountInput) || 0;
    }

    let subTotal = total - discount;

    $("#totalText").text(total.toFixed(2));
    $("#subTotalText").text(subTotal.toFixed(2));

    let cash = parseFloat($("#cash").val()) || 0;

    $("#balance").val((cash - subTotal).toFixed(2));
}


function purchaseOrder() {

    if (cart.length === 0) return alert("Cart Empty");

    let order = {
        orderId: $("#orderId").val(),
        date: $("#orderDate").val(),
        customerId: $("#orderCustomerId").val(),
        total: $("#subTotalText").text(),
        items: cart
    };

    saveOrder(order);

    cart.forEach(c => {

        let items = getAllItems();

        let index = items.findIndex(i => i.itemId === c.itemId);

        items[index].itemQty -= c.qty;

        updateItem(index, items[index]);
    });

    alert("Purchased Successfully");

    refresh();
}


function generateOrderId() {

    let orders = getAllOrders();

    if (orders.length === 0) {
        $("#orderId").val("O001");
        return;
    }

    let last = orders[orders.length - 1].orderId;

    let num = parseInt(last.substring(1)) + 1;

    $("#orderId").val("O" + num.toString().padStart(3, "0"));
}

function clearFields() {

    $("#orderCustomerName").val("");
    $("#orderCustomerSalary").val("");
    $("#orderCustomerAddress").val("");

    $("#orderItemName").val("");
    $("#orderItemPrice").val("");
    $("#orderQtyOnHand").val("");
    $("#orderQty").val("");

    $("#discount").val("");
    $("#cash").val("");
    $("#balance").val("");
}
function clearItemFields() {

    $("#orderItemCode").val("");
    $("#orderItemName").val("");
    $("#orderItemPrice").val("");
    $("#orderQtyOnHand").val("");
    $("#orderQty").val("");
}