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
            $mess = $_POST['mess'];
            $customer = $_POST['customer'];
            $doctor = $_POST['doctor'];
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

    function add_zoom()
    {
        $user =  tokenLogin($_POST["token"]);
        $data = false;
        if ($this->method == 'POST' && $user) {
            include('connect.php');
            $time = date('Y-m-d H:i:s ');
            $zoom = $_POST['zoomID'];
            $doctor = $_POST['doctor'];
            $sql = "DELETE FROM rt_zoom WHERE date('$time') = date(timeInput) AND zoom = '$zoom'";
            mysqli_set_charset($conn, 'UTF8');
            $conn->query($sql);
            $sql = "INSERT INTO rt_zoom(zoom, doctor, timeInput) VALUE ('$zoom', '$doctor', '$time')";
            mysqli_set_charset($conn, 'UTF8');
            $conn->query($sql);
            $conn->close();
            $data = true;
            $this->response(200, $data);
        }
    }

    function get_rating()
    {
        $user =  tokenLogin($_GET["token"]);
        $data = [];
        if ($this->method == 'GET' && $user) {
            include('connect.php');
            $dateBegin = $_GET['dateBegin'];
            $dateEnd = $_GET['dateEnd'];
            $sql = "SELECT * FROM rt_rating WHERE date(timeInput) >= '$dateBegin' AND date(timeInput) <= '$dateEnd' ORDER BY timeInput DESC";
            // echo $sql;
            // rt_log($user["user"], "add_customer", $sql, $time);
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

    function get_rating_point()
    {
        $user =  tokenLogin($_GET["token"]);
        $data = [];
        if ($this->method == 'GET' && $user) {
            include('connect.php');
            $dateBegin = $_GET['dateBegin'];
            $dateEnd = $_GET['dateEnd'];
            $point = $_GET['point'];
            $sql = "SELECT * FROM rt_rating WHERE point = $point AND date(timeInput) >= '$dateBegin' AND date(timeInput) <= '$dateEnd'";
            // echo $sql;
            // rt_log($user["user"], "add_customer", $sql, $time);
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

    function get_view_rating()
    {
        $user =  tokenLogin($_GET["token"]);
        $data = [];
        if ($this->method == 'GET' && $user) {
            include('connect.php');
            $dateBegin = $_GET['dateBegin'];
            $dateEnd = $_GET['dateEnd'];
            $point = $_GET['point'];
            if ($point != 'null') {
                $sql = "SELECT * FROM rt_rating WHERE date(timeInput) >= '$dateBegin' AND date(timeInput) <= '$dateEnd' AND point = $point";
            } else {
                $sql = "SELECT * FROM rt_rating WHERE date(timeInput) >= '$dateBegin' AND date(timeInput) <= '$dateEnd' AND point is NULL";
            }
            // echo $sql;
            // rt_log($user["user"], "add_customer", $sql, $time);
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

    function get_view_doctor()
    {
        $user =  tokenLogin($_GET["token"]);
        $data = [];
        if ($this->method == 'GET' && $user) {
            include('connect.php');
            $dateBegin = $_GET['dateBegin'];
            $dateEnd = $_GET['dateEnd'];
            $name = $_GET['name'];
            if ($name != 'null') {
                $sql = "SELECT * FROM rt_rating WHERE date(timeInput) >= '$dateBegin' AND date(timeInput) <= '$dateEnd' AND doctor = '$name' ORDER BY point ASC;";
            } else {
                $sql = "SELECT * FROM rt_rating WHERE date(timeInput) >= '$dateBegin' AND date(timeInput) <= '$dateEnd' AND doctor is NULL ORDER BY point ASC;";
            }
            // echo $sql;
            // rt_log($user["user"], "add_customer", $sql, $time);
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

    function get_doctor_rating()
    {
        $user =  tokenLogin($_GET["token"]);
        $data = [];
        if ($this->method == 'GET' && $user) {
            include('connect.php');
            $dateBegin = $_GET['dateBegin'];
            $dateEnd = $_GET['dateEnd'];
            $sql = "SELECT doctor, AVG(point) AS pointAVG, COUNT(doctor) AS countDoctor FROM rt_rating WHERE date(timeInput) >= '$dateBegin' AND date(timeInput) <= '$dateEnd' GROUP BY doctor ORDER BY pointAVG DESC;";
            // echo $sql;
            // rt_log($user["user"], "add_customer", $sql, $time);
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

    function get_rating_synthetic()
    {
        $user =  tokenLogin($_GET["token"]);
        $data = [];
        if ($this->method == 'GET' && $user) {
            include('connect.php');
            $dateBegin = $_GET['dateBegin'];
            $dateEnd = $_GET['dateEnd'];
            $sql = "SELECT content, COUNT(*) AS quantity FROM `rt_rating` WHERE date(timeInput) >= '$dateBegin' AND date(timeInput) <= '$dateEnd'  GROUP BY content";
            // echo $sql;
            // rt_log($user["user"], "add_customer", $sql, $time);
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


    function get_zoom()
    {
        $user =  tokenLogin($_GET["token"]);
        $data = false;
        if ($this->method == 'GET' && $user) {
            include('connect.php');
            $time = date('Y-m-d H:i:s ');
            $sql = "SELECT * FROM rt_zoom WHERE date('$time') = date(timeInput)";
            // rt_log($user["user"], "add_customer", $sql, $time);
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
}



$user_api = new api();
