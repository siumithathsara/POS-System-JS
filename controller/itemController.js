import {
    saveItem,
    getAllItems,
    updateItem,
    deleteItem
} from "../model/itemModel.js";

$(document).ready(function () {
    init();
});

function init() {
    refreshItem();
    bindItemEvents();
}

function bindItemEvents() {

    $("#itemSaveBtn").on("click", saveHandler);
    $("#itemUpdateBtn").on("click", updateHandler);
    $("#itemDeleteBtn").on("click", deleteHandler);
    $("#itemSearchBtn").on("click", searchHandler);
    $("#itemResetBtn").on("click", refreshItem);

    $("#itemTableBody").on("click", "tr", tableClick);

    $("#itemName").on("input", function () {
        this.value = formatText(this.value);
    });

    $("#itemCode").on("input", function () {
        this.value = this.value.toUpperCase();
    });
}


function saveHandler() {

    let item = getFormData();

    if (!validate(item)) return;

    saveItem(item);
    showMsg("Item Saved ");
    refreshItem();
}


function updateHandler() {

    let item = getFormData();

    let items = getAllItems();

    let index = items.findIndex(i => i.itemId === item.itemId);

    if (index === -1) {
        showMsg("Item Not Found");
        return;
    }

    if (!validate(item)) return;

    updateItem(index, item);
    showMsg("Item Updated ");
    refreshItem();
}


function deleteHandler() {

    let id = $("#itemCode").val();

    let items = getAllItems();

    let index = items.findIndex(i => i.itemId === id);

    if (index === -1) {
        showMsg("Item Not Found");
        return;
    }

    deleteItem(index);
    showMsg("Item Deleted ");
    refreshItem();
}


function searchHandler() {

    let id = $("#itemCode").val();

    let item = getAllItems().find(i => i.itemId === id);

    if (!item) {
        showMsg("Item Not Found");
        return;
    }

    setFormData(item);
}


function getFormData() {
    return {
        itemId: $("#itemCode").val().toUpperCase(),
        itemName: formatText($("#itemName").val()),
        itemQty: $("#itemQty").val(),
        itemPrice: $("#unitPrice").val()
    };
}


function setFormData(i) {
    $("#itemCode").val(i.itemId);
    $("#itemName").val(i.itemName);
    $("#itemQty").val(i.itemQty);
    $("#unitPrice").val(i.itemPrice);
}


function validate(i) {

    let valid = true;

    if (!/^I\d{3}$/.test(i.itemId)) {
        showMsg("Use Item Code format I001");
        valid = false;
    }

    else if (i.itemName === "") {
        showMsg("Enter Item Name");
        valid = false;
    }

    else if (!/^\d+$/.test(i.itemQty)) {
        showMsg("Qty must be number");
        valid = false;
    }

    else if (!/^\d+(\.\d+)?$/.test(i.itemPrice)) {
        showMsg("Price must be number");
        valid = false;
    }

    return valid;
}


function loadTable() {

    $("#itemTableBody").empty();

    getAllItems().forEach(i => {

        $("#itemTableBody").append(`
            <tr>
                <td>${i.itemId}</td>
                <td>${i.itemName}</td>
                <td>${i.itemQty}</td>
                <td>${formatMoney(i.itemPrice)}</td>
            </tr>
        `);

    });
}

function tableClick() {

    let row = $(this).children();

    setFormData({
        itemId: row.eq(0).text(),
        itemName: row.eq(1).text(),
        itemQty: row.eq(2).text(),
        itemPrice: row.eq(3).text()
    });
}


function refreshItem() {
    clearFields();
    generateId();
    loadTable();
}


function clearFields() {
    $("#itemName,#itemQty,#unitPrice").val("");
}


function generateId() {

    let items = getAllItems();

    if (items.length === 0) {
        $("#itemCode").val("I001");
        return;
    }

    let last = items[items.length - 1].itemId;

    let num = parseInt(last.substring(1)) + 1;

    $("#itemCode").val("I" + num.toString().padStart(3, "0"));
}


function formatText(value) {

    return value
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}


function formatMoney(value) {
    return parseFloat(value).toFixed(2);
}


function showMsg(msg) {
    alert(msg);
}