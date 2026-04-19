import {
    saveCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer
} from "../model/customerModel.js";

$(document).ready(function () {
    init();
});

function init() {
    refresh();
    bindEvents();
}

function bindEvents() {

    $("#saveBtn").on("click", saveHandler);
    $("#updateBtn").on("click", updateHandler);
    $("#deleteBtn").on("click", deleteHandler);
    $("#searchBtn").on("click", searchHandler);
    $("#resetBtn").on("click", refresh);

    $("#customerTableBody").on("click", "tr", tableClick);

   
    $("#cusName, #cusAddress").on("input", function () {
        this.value = formatText(this.value);
    });

    $("#cusId").on("input", function () {
        this.value = this.value.toUpperCase();
    });

}

function saveHandler() {

    let customer = getFormData();

    if (!validate(customer)) return;

    saveCustomer(customer);
    showMsg("Customer Saved ");
    refresh();
}

function updateHandler() {

    let customer = getFormData();
    let customers = getAllCustomers();

    let index = customers.findIndex(c => c.cusId === customer.cusId);

    if (index === -1) {
        showMsg("Customer Not Found ");
        return;
    }

    if (!validate(customer)) return;

    updateCustomer(index, customer);
    showMsg("Customer Updated ✔");
    refresh();
}

function deleteHandler() {

    let id = $("#cusId").val();
    let customers = getAllCustomers();

    let index = customers.findIndex(c => c.cusId === id);

    if (index === -1) {
        showMsg("Customer Not Found ");
        return;
    }

    deleteCustomer(index);
    showMsg("Customer Deleted ");
    refresh();
}

function searchHandler() {

    let id = $("#cusId").val();
    let customer = getAllCustomers().find(c => c.cusId === id);

    if (!customer) {
        showMsg("Customer Not Found ");
        return;
    }

    setFormData(customer);
}



function getFormData() {
    return {
        cusId: $("#cusId").val().toUpperCase(),
        cusName: formatText($("#cusName").val()),
        cusAddress: formatText($("#cusAddress").val()),
        cusSalary: $("#cusSalary").val()
    };
}

function setFormData(c) {
    $("#cusId").val(c.cusId);
    $("#cusName").val(c.cusName);
    $("#cusAddress").val(c.cusAddress);
    $("#cusSalary").val(c.cusSalary);
}


function validate(c) {

    let valid = true;

    clearErrors();

    // ID FORMAT
    if (!/^C\d{3}$/.test(c.cusId)) {
        setError("invalidCusId", "Use format C001");
        valid = false;
    }

    // NAME
    if (!c.cusName) {
        setError("invalidCusName", "Enter Name");
        valid = false;
    }

    // ADDRESS
    if (!c.cusAddress) {
        setError("invalidCusAddress", "Enter Address");
        valid = false;
    }

    // SALARY (NUMBER ONLY)
    if (!/^\d+(\.\d+)?$/.test(c.cusSalary)) {
        setError("invalidCusSalary", "Salary must be number");
        valid = false;
    }

    return valid;

    
}
function formatMoney(value) {
    if (value === "" || value === null || isNaN(value)) {
        return "0.00";
    }
    return parseFloat(value).toFixed(2);
}

function loadTable() {

    $("#customerTableBody").empty();

    getAllCustomers().forEach(c => {
        $("#customerTableBody").append(`
            <tr>
                <td>${c.cusId}</td>
                <td>${c.cusName}</td>
                <td>${c.cusAddress}</td>
                <td>${formatMoney(c.cusSalary)}</td>
            </tr>
        `);
    });

}

function tableClick() {

    let row = $(this).children();

    setFormData({
        cusId: row.eq(0).text(),
        cusName: row.eq(1).text(),
        cusAddress: row.eq(2).text(),
        cusSalary: row.eq(3).text()
    });

}


function refresh() {
    clearFields();
    generateId();
    loadTable();
}

function clearFields() {
    $("#cusName, #cusAddress, #cusSalary").val("");
    clearErrors();
}

function clearErrors() {
    $(".invalidCusId, .invalidCusName, .invalidCusAddress, .invalidCusSalary").text("");
}

function setError(cls, msg) {
    $("." + cls).text(msg);
}

function generateId() {

    let customers = getAllCustomers();

    if (customers.length === 0) {
        $("#cusId").val("C001");
        return;
    }

    let last = customers[customers.length - 1].cusId;
    let num = parseInt(last.substring(1)) + 1;

    $("#cusId").val("C" + num.toString().padStart(3, "0"));
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

function showMsg(msg) {
    alert(msg); 
}