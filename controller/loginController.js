import { userDB } from "../db/db.js";

$(document).ready(function () {

    $("#loginBtn").click(function () {

        let username = $("#username").val().trim();
        let password = $("#password").val().trim();

        let validUser = userDB.find(user =>
            user.username === username &&
            user.password === password
        );

        if (validUser) {
            $("#errorMsg").hide();
            $("#loginPage").hide();
            $("#mainPage").show();

            // alert("Login Success");

        } else {

            $("#errorMsg")
                .text("Invalid Username or Password")
                .show();

        }

    });

    $("#logoutBtn").click(function () {

        $("#mainPage").hide();
        $("#loginPage").show();

        $("#username").val("");
        $("#password").val("");

    });

});