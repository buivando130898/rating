<?php
require 'restful_api.php';
date_default_timezone_set('Asia/Ho_Chi_Minh');

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

function getHandleData($key)
{
    return isset($_POST[$key]) ? htmlspecialchars(trim($_GET[$key]), ENT_QUOTES, 'UTF-8') : null;
}

function postHandleData($key)
{
    return isset($_POST[$key]) ? htmlspecialchars(trim($_POST[$key]), ENT_QUOTES, 'UTF-8') : null;
}

class api extends restful_api
{

    function __construct()
    {
        parent::__construct();
    }

    function add_general()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            include('connect.php');
            $time = date('Y-m-d H:i:s ');
            $op_no =  postHandleData("op_no");
            $name =  postHandleData("name");
            $phone  =  postHandleData("phone");
            $mail =  postHandleData("mail");
            $why =  postHandleData("why");
            $good =  postHandleData("good");
            $source =  postHandleData("source");
            $satisfied =  postHandleData("satisfied");
            $introduce =  postHandleData("introduce");
            $sql = "INSERT INTO rt_general(op_no, name, phone, mail, why, good, source, satisfied, introduce, time_input) VALUE ('$op_no', '$name', '$phone', '$mail', '$why', '$good', '$source', $satisfied, $introduce, '$time')";
            // echo $sql;
            mysqli_set_charset($conn, 'UTF8');
            $conn->query($sql);
            $conn->close();
            $data = true;
        }
        $this->response(200, $data);
    }

    function add_general2()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            include('connect.php');
            $time = date('Y-m-d H:i:s ');
            $op_no =  postHandleData("op_no");
            $name =  postHandleData("name");
            $phone  =  postHandleData("phone");
            $mail =  postHandleData("mail");
            $why =  postHandleData("why");
            $good =  postHandleData("good");
            $source =  postHandleData("source");
            $satisfied =  postHandleData("satisfied");
            $introduce =  postHandleData("introduce");
            $time_input = postHandleData("time_input");
            $sql = "INSERT INTO rt_general(op_no, name, phone, mail, why, good, source, satisfied, introduce, time_input) VALUE ('$op_no', '$name', '$phone', '$mail', '$why', '$good', '$source', $satisfied, $introduce, '$time_input')";
            // echo $sql;
            mysqli_set_charset($conn, 'UTF8');
            $conn->query($sql);
            $conn->close();
            $data = true;
        }
        $this->response(200, $data);
    }
}

$user_api = new api();
