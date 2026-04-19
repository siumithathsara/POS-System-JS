import {
    saveCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer
} from "../model/customer.js";

$(document).ready(function () {
    refresh();
});

/* SAVE */
$("#saveBtn").click(function () {

    let customer = {
        cusId: $("#cusId").val(),
        cusName: $("#cusName").val(),
        cusAddress: $("#cusAddress").val(),
        cusSalary: $("#cusSalary").val()
    };

    if (validate(customer)) {
        saveCustomer(customer);
        alert("Customer Saved");
        refresh();
    }

});

/* UPDATE */
$("#updateBtn").click(function () {

    let customer = {
        cusId: $("#cusId").val(),
        cusName: $("#cusName").val(),
        cusAddress: $("#cusAddress").val(),
        cusSalary: $("#cusSalary").val()
    };

    let customers = getAllCustomers();

    let index = customers.findIndex(c => c.cusId === customer.cusId);

    if (index >= 0) {
        updateCustomer(index, customer);
        alert("Customer Updated");
        refresh();
    }

});

/* DELETE */
$("#deleteBtn").click(function () {

    let id = $("#cusId").val();

    let customers = getAllCustomers();

    let index = customers.findIndex(c => c.cusId === id);

    if (index >= 0) {
        deleteCustomer(index);
        alert("Customer Deleted");
        refresh();
    } else {
        alert("Customer Not Found");
    }

});

/* SEARCH */
$("#searchBtn").click(function () {

    let id = $("#cusId").val();

    let customer = getAllCustomers().find(c => c.cusId === id);

    if (customer) {
        $("#cusName").val(customer.cusName);
        $("#cusAddress").val(customer.cusAddress);
        $("#cusSalary").val(customer.cusSalary);
    } else {
        alert("Customer Not Found");
    }

});

/* RESET */
$("#resetBtn").click(function () {
    refresh();
});

/* TABLE CLICK */
$("#customerTableBody").on("click", "tr", function () {

    $("#cusId").val($(this).children().eq(0).text());
    $("#cusName").val($(this).children().eq(1).text());
    $("#cusAddress").val($(this).children().eq(2).text());
    $("#cusSalary").val($(this).children().eq(3).text());

});

/* FUNCTIONS */

function refresh() {
    clearFields();
    generateId();
    loadTable();
}

function clearFields() {
    $("#cusName").val("");
    $("#cusAddress").val("");
    $("#cusSalary").val("");

    $(".invalidCusId").text("");
    $(".invalidCusName").text("");
    $(".invalidCusAddress").text("");
    $(".invalidCusSalary").text("");
}

function generateId() {

    let customers = getAllCustomers();

    if (customers.length === 0) {
        $("#cusId").val("C001");
        return;
    }

    let lastId = customers[customers.length - 1].cusId;

    let num = parseInt(lastId.substring(1)) + 1;

    let newId = "C" + num.toString().padStart(3, "0");

    $("#cusId").val(newId);
}

function loadTable() {

    $("#customerTableBody").empty();

    let customers = getAllCustomers();

    customers.forEach(c => {

        $("#customerTableBody").append(`
            <tr>
                <td>${c.cusId}</td>
                <td>${c.cusName}</td>
                <td>${c.cusAddress}</td>
                <td>${c.cusSalary}</td>
            </tr>
        `);

    });

}

function validate(customer) {

    let valid = true;

    if (customer.cusName === "") {
        $(".invalidCusName").text("Enter Name");
        valid = false;
    } else {
        $(".invalidCusName").text("");
    }

    if (customer.cusAddress === "") {
        $(".invalidCusAddress").text("Enter Address");
        valid = false;
    } else {
        $(".invalidCusAddress").text("");
    }

    if (customer.cusSalary === "" || customer.cusSalary <= 0) {
        $(".invalidCusSalary").text("Invalid Salary");
        valid = false;
    } else {
        $(".invalidCusSalary").text("");
    }

    return valid;
}