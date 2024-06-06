<?php
require 'restful_api.php';

function tokenLogin($token)
{
    include('connect.php');
    $sql = "SELECT manager, user FROM rt_user WHERE token = '$token'";
    mysqli_set_charset($conn, 'UTF8');
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            return $row;
        }
    }
    return false;
}

function rt_log($user, $cmd_content, $cmd_sql)
{
    include('connect.php');
    $time = date('Y-m-d H:i:s ');
    $cmd_sql = addslashes($cmd_sql);
    $sql = "INSERT INTO rt_log(user , cmd_content, cmd_sql, timeInput) VALUES ('$user', '$cmd_content', '$cmd_sql', '$time')";
    // echo $sql;
    $result = $conn->query($sql);
    $conn->close();
}

class api extends restful_api
{

    function __construct()
    {
        parent::__construct();
    }

    function add_rating()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            include('connect.php');
            $time = date('Y-m-d H:i:s ');
            $zoom = $_POST['zoom'];
            $content = $_POST['content'];
            // $customer = $_POST['customer'];
            $doctor = $_POST['doctor'];
            $sql = "INSERT INTO rt_rating(zoom, content, doctor, customer, timeInput) VALUE ('$zoom', '$content', '$doctor', '$customer', '$time')";
            // rt_log($user["user"], "add_customer", $sql, $time);
            mysqli_set_charset($conn, 'UTF8');
            $conn->query($sql);
            $conn->close();
            $data = true;
            $this->response(200, $data);
        }
    }
    function get_rating()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            include('connect.php');
            $dateBegin = $_GET['dateBegin'];
            $dateEnd = $_POST['dateEnd'];
            $sql = "SELECT * FROM rt_rating WHERE date(timeInput) > '$dateBegin' AND date(timeInput) < '$dateEnd'";
            echo $sql;
            // rt_log($user["user"], "add_customer", $sql, $time);
            mysqli_set_charset($conn, 'UTF8');
            $conn->query($sql);
            $conn->close();
            $data = true;
            $this->response(200, $data);
        }
    }
}



$user_api = new api();
