import { getAllCustomers } from "../model/customerModel.js";
import { getAllItems } from "../model/itemModel.js";
import { getAllOrders } from "../model/orderModel.js";

$(document).ready(function () {
    loadDashboard();
});

$("#homeNav").on("click", function () {
    loadDashboard();
});

function loadDashboard() {

    $("#customerCount").text(getAllCustomers().length);
    $("#itemCount").text(getAllItems().length);
    $("#orderCount").text(getAllOrders().length);
}