<?php
    // |====================================================|
    // |                     logout.php                     |
    // |            Copyright (c) 2018 Belikhun.            |
    // |      This file is licensed under MIT license.      |
    // |====================================================|
    

    // Include config file
    require_once $_SERVER["DOCUMENT_ROOT"]."/lib/api_ecatch.php";
    require_once $_SERVER["DOCUMENT_ROOT"]."/lib/ratelimit.php";
    require_once $_SERVER["DOCUMENT_ROOT"]."/lib/belibrary.php";
    
    if (!islogedin())
        stop(10, "You Are Not Logged In!", 403);

    if (!isset($_POST["t"]))
        stop(14, "Token required.", 400);
    if ($_POST["t"] !== $_SESSION["api_token"])
        stop(27, "Wrong token!", 403);

    // Unset all of the session variables
    $_SESSION = array();
    $_SESSION["username"] = null;

    stop(0, "Logout Successfully!", 200);

?>