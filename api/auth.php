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

function save_log($user, $cmd_content, $cmd_sql)
{
    include('connect.php');
    $time = date('Y-m-d H:i:s ');
    $cmd_sql = addslashes($cmd_sql);
    $sql = "INSERT INTO khuyenmai_log(user , cmd_content, cmd_sql, timeInput) VALUES ('$user', '$cmd_content', '$cmd_sql', '$time')";
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

    function login()
    {
        if ($this->method == 'POST') {
            $data = false;
            if (isset($_POST["user"]) && isset($_POST["pass"])) {
                include('connect.php');
                $user = addslashes($_POST["user"]);
                $pass = addslashes($_POST["pass"]);

                $sql = "SELECT  * FROM  rt_user   Where user = BINARY '$user' AND pass = BINARY '$pass'";
                mysqli_set_charset($conn, 'UTF8');
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }
                }
                $conn->close();
                $this->response(200, $data);
            }
            $this->response(200, $data);
        }
    }

    function token_check()
    {
        if ($this->method == 'POST') {
            $data = false;
            if (isset($_POST["token"])   &&  isset($_POST["user"])) {
                $token = $_POST["token"];
                $user = $_POST["user"];
                include('connect.php');

                $sql = "SELECT  user FROM  rt_user  WHERE token = BINARY '$token'  AND user = BINARY '$user'";
                mysqli_set_charset($conn, 'UTF8');
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    $data = true;
                }

                $conn->close();
            }
            $this->response(200, $data);
        }
    }



    function pass_new()
    {
        if ($this->method == 'POST') {
            if (isset($_POST["user"]) && isset($_POST["pass"]) && isset($_POST["pass_new"])) {
                include('connect.php');
                $user = addslashes($_POST["user"]);
                $pass = addslashes($_POST["pass"]);
                $pass_new = addslashes($_POST["pass_new"]);
                $token = md5($user . $pass_new);

                $sql = "SELECT acc FROM  rt_user   Where acc = BINARY '$user' AND pass = BINARY '$pass'";
                mysqli_set_charset($conn, 'UTF8');
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    $sql = "UPDATE  rt_user  SET pass = '$pass_new', token = '$token' WHERE acc = '$user'";
                    mysqli_set_charset($conn, 'UTF8');
                    $result = $conn->query($sql);
                    $data = "Cập nhật mật khẩu mới thành công";
                } else {
                    $data = "Thông tin tài khoản hoặc mật khẩu không chính xác";
                }

                $conn->close();
                $this->response(200, $data);
            }
        }
    }

    function get_user()
    {
        $user =  tokenLogin($_GET["token"]);
        if ($this->method == 'GET' && $user) {
            $data = false;
            include('connect.php');
            $sql = "SELECT * FROM rt_user WHERE user != 'admin'";
            mysqli_set_charset($conn, 'UTF8');
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
            }
            $conn->close();
            $this->response(200, $data);
        }
    }

    // Theem user
    function add_user()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            if (isset($_POST["user"]) && isset($_POST["name"]) && isset($_POST["manager"]) && isset($_POST["pass"])) {
                include('connect.php');
                $time = date('Y-m-d H:i:s ');
                $user2 = $_POST["user"];
                $name = $_POST["name"];
                $manager = $_POST["manager"];
                $pass = $_POST["pass"];
                $token = md5($user2 . $pass);

                $sql = "INSERT INTO rt_user(user, name, pass, token, manager) VALUE ('$user2', '$name', '$pass', '$token', '$manager'  )";
                save_log($user["user"], "add_user", $sql);
                mysqli_set_charset($conn, 'UTF8');
                $conn->query($sql);
                $conn->close();
                $data = true;
                $this->response(200, $data);
            }
        }
        $this->response(200, $data);
    }

    // Theem user
    function change_user()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            if (isset($_POST["user"]) && isset($_POST["name"]) && isset($_POST["manager"])) {
                include('connect.php');
                $time = date('Y-m-d H:i:s ');
                $stt = $_POST["stt"];
                $user2 = $_POST["user"];
                $name = $_POST["name"];
                $manager = $_POST["manager"];
                $pass = $_POST["pass"];
                if ($pass) {
                    $sql = "UPDATE rt_user SET user = '$user2', name = '$name', manager = '$manager', pass = '$pass' WHERE stt = $stt ";
                } else {
                    $token = md5($user2 . $pass);
                    $sql = "UPDATE rt_user SET user = '$user2', token = '$token', name = '$name', manager = '$manager' WHERE stt = $stt ";
                }
                // echo $sql;
                save_log($user["user"], "add_user", $sql);
                mysqli_set_charset($conn, 'UTF8');
                $conn->query($sql);
                $conn->close();
                $data = true;
                $this->response(200, $data);
            }
        }
        $this->response(200, $data);
    }



    // Xoa km 
    function delete_user()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            if (isset($_POST["stt"])) {
                include('connect.php');
                $time = date('Y-m-d H:i:s ');
                $stt = $_POST["stt"];
                $sql = "DELETE FROM rt_user WHERE stt = $stt";
                // echo $sql;
                save_log($user["user"], "delete_user", $sql, $time);
                mysqli_set_charset($conn, 'UTF8');
                $conn->query($sql);
                $conn->close();
                $data = true;
                $this->response(200, $data);
            }
        }
        $this->response(200, $data);
    }
}

$user_api = new api();
