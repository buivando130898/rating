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

function get_doctor($zoomID)
{
    include('connect.php');
    $sql = "SELECT doctor FROM rt_zoom WHERE zoom = '$zoomID'";
    mysqli_set_charset($conn, 'UTF8');
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            return $row["doctor"];
        }
    }
    return false;
}

class api extends restful_api
{

    function __construct()
    {
        parent::__construct();
    }

    function add_doctor()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            include('connect.php');
            $time = date('Y-m-d H:i:s ');
            $name = $_POST['name'];
            $office  = $_POST['office'];
            $note = $_POST['note'];

            $sql = "INSERT INTO rt_doctor(name, office, note, time_input) VALUE ( '$name', '$office', '$note', '$time')";
            mysqli_set_charset($conn, 'UTF8');
            $conn->query($sql);
            $conn->close();
            $data = true;
            $this->response(200, $data);
        }
    }

    function delete_doctor()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            include('connect.php');
            // $time = date('Y-m-d H:i:s ');
            $id = $_POST['id'];
            $sql = "DELETE FROM rt_doctor WHERE id = $id";
            mysqli_set_charset($conn, 'UTF8');
            $conn->query($sql);
            $conn->close();
            $data = true;
            $this->response(200, $data);
        }
    }

    function get_doctor()
    {
        $user =  tokenLogin($_GET["token"]);
        $data = [];
        if ($this->method == 'GET' && $user) {
            include('connect.php');
            $sql = "SELECT * FROM rt_doctor";
            mysqli_set_charset($conn, 'UTF8');
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
            }
            $conn->query($sql);
            $conn->close();

            $this->response(200, $data);
        }
    }

    function add_zoom()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            include('connect.php');
            $time = date('Y-m-d H:i:s ');
            $zoom  = $_POST['zoom'];
            $name = $_POST['name'];
            $note = $_POST['note'];

            $sql = "INSERT INTO rt_zoom(zoom, name, note, timeInput) VALUE ( '$zoom', '$name', '$note', '$time')";
            mysqli_set_charset($conn, 'UTF8');
            $conn->query($sql);
            $conn->close();
            $data = true;
            $this->response(200, $data);
        }
    }

    function get_room()
    {
        $user =  tokenLogin($_GET["token"]);
        $data = [];
        if ($this->method == 'GET' && $user) {
            include('connect.php');
            $sql = "SELECT * FROM rt_zoom";
            mysqli_set_charset($conn, 'UTF8');
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
            }
            $conn->query($sql);
            $conn->close();
            $this->response(200, $data);
        }
    }

    function delete_room()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            include('connect.php');
            // $time = date('Y-m-d H:i:s ');
            $stt = $_POST['stt'];
            $sql = "DELETE FROM rt_zoom WHERE stt = $stt";
            mysqli_set_charset($conn, 'UTF8');
            $conn->query($sql);
            $conn->close();
            $data = true;
            $this->response(200, $data);
        }
    }

    function edit_doctor_zoom()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            include('connect.php');
            $time = date('Y-m-d H:i:s ');
            $zoom  = $_POST['zoom'];
            $doctor = $_POST['doctor'];

            $sql = "UPDATE rt_zoom SET doctor = '$doctor', timeInput = '$time' WHERE zoom = '$zoom' ";
            // echo $sql;
            mysqli_set_charset($conn, 'UTF8');
            $conn->query($sql);
            $conn->close();
            $data = true;
            $this->response(200, $data);
        }
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
            $mess = $_POST['mess'];
            $customer = $_POST['customer'];
            $doctor = get_doctor($zoom);
            $point = 0;
            if ($content == "Rất không hài lòng") {
                $point = 1;
            } else if ($content == "Không hài lòng") {
                $point = 2;
            } else if ($content == "Bình thường") {
                $point = 3;
            } else if ($content == "Hài lòng") {
                $point = 4;
            } else if ($content == "Rất hài lòng") {
                $point = 5;
            }

            $sql = "INSERT INTO rt_rating(zoom, content, point, doctor, customer, mess, timeInput) VALUE ('$zoom', '$content', '$point', '$doctor', '$customer', '$mess', '$time')";
            // echo $sql;
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
