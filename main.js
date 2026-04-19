$(document).ready(function(){

    $("#homePage").show();
    $("#customerPage").hide();
    $("#itemPage").hide();

    $("#homeNav").click(function(e){
        e.preventDefault();

        $("#homePage").show();
        $("#customerPage").hide();
        $("#itemPage").hide();
        $("#orderPage").hide();
    });

    $("#customerNav").click(function(e){
        e.preventDefault();

        $("#customerPage").show();
        $("#homePage").hide();
        $("#itemPage").hide();
        $("#orderPage").hide();
    });

    $("#itemNav").click(function(e){
        e.preventDefault();

        $("#itemPage").show();
        $("#homePage").hide();
        $("#customerPage").hide();
        $("#orderPage").hide();
    });
     $("#orderNav").click(function(e){
        e.preventDefault();

        $("#orderPage").show();
        $("#homePage").hide();
        $("#customerPage").hide();
        $("#itemPage").hide();
    });

});