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

function checkTest($str)
{
        // Kiểm tra xem chuỗi có chứa từ "test" không
        if (strpos($str, 'test') !== false) {
                return false;
        } else {
                return true;
        }
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
        function add_customer()
        {
                $user =  tokenLogin($_POST["token"]);
                $data = false;
                if ($this->method == 'POST' && $user) {
                        include('connect.php');
                        $time = date('Y-m-d H:i:s ');
                        $op_no =  postHandleData("op_no");
                        $name =  postHandleData("name");
                        $examination_date  =  postHandleData("examination_date");
                        $referrer =  postHandleData("referrer");
                        $gender =  postHandleData("gender");
                        $age =  postHandleData("age");
                        $address =  postHandleData("address");
                        $remarks =  postHandleData("remarks");
                        if ($op_no && checkTest($name)) {
                                $sql = "INSERT INTO rt_customer(op_no, name, examination_date, referrer, gender, age, address, remarks, time_input) VALUE ('$op_no', '$name', '$examination_date', '$referrer', '$gender', $age, '$address', '$remarks', '$time')";
                                // echo $sql;
                                $data = true;
                        } else {
                                $data = false;
                        }
                        // echo $sql;
                        mysqli_set_charset($conn, 'UTF8');
                        $conn->query($sql);
                        $conn->close();
                }
                $this->response(200, $data);
        }

        function get_info_customer()
        {
                $user =  tokenLogin($_GET["token"]);
                $data = [];
                if ($this->method == 'GET' && $user) {
                        $dateBegin = $_GET['dateBegin'];
                        $dateEnd = $_GET['dateEnd'];
                        include('connect.php');
                        $sql = "SELECT COUNT(*) AS total_customers, COUNT(CASE WHEN gender = 'Male' THEN 1 END) AS male_customers, COUNT(CASE WHEN gender = 'Female' THEN 1 END) AS female_customers FROM rt_customer WHERE examination_date BETWEEN '$dateBegin' AND '$dateEnd';";
                        // echo $sql;
                        mysqli_set_charset($conn, 'UTF8');
                        $result = $conn->query($sql);
                        if ($result->num_rows > 0) {
                                while ($row = $result->fetch_assoc()) {
                                        $data[] = $row;
                                }
                        }
                        $conn->query($sql);
                        $conn->close();

                        $this->response(200, $data[0]);
                }
        }

        function get_customer_age()
        {
                $user =  tokenLogin($_GET["token"]);
                $data = [];
                if ($this->method == 'GET' && $user) {
                        $dateBegin = $_GET['dateBegin'];
                        $dateEnd = $_GET['dateEnd'];
                        include('connect.php');
                        $sql = "
                                SELECT 
                                CASE
                                        WHEN age BETWEEN 11 AND 15 THEN '11-15'
                                        WHEN age BETWEEN 16 AND 20 THEN '16-20'
                                        WHEN age BETWEEN 21 AND 25 THEN '21-25'
                                        WHEN age BETWEEN 26 AND 30 THEN '26-30'
                                        WHEN age BETWEEN 31 AND 35 THEN '31-35'
                                        WHEN age BETWEEN 36 AND 40 THEN '36-40'
                                        WHEN age BETWEEN 41 AND 45 THEN '41-45'
                                        WHEN age BETWEEN 46 AND 50 THEN '46-50'
                                        WHEN age BETWEEN 51 AND 55 THEN '51-55'
                                        WHEN age BETWEEN 56 AND 60 THEN '56-60'
                                        WHEN age BETWEEN 61 AND 65 THEN '61-65'
                                        WHEN age BETWEEN 66 AND 70 THEN '66-70'
                                        WHEN age BETWEEN 71 AND 75 THEN '71-75'
                                        WHEN age BETWEEN 76 AND 80 THEN '76-80'
                                        WHEN age BETWEEN 81 AND 85 THEN '81-85'
                                        WHEN age BETWEEN 86 AND 90 THEN '86-90'
                                        WHEN age BETWEEN 91 AND 95 THEN '91-95'
                                        WHEN age BETWEEN 96 AND 100 THEN '96-100'
                                        ELSE 'Khác' -- Trường hợp tuổi không nằm trong khoảng từ 11 đến 100
                                END AS age_range,
                                COUNT(*) AS customer_count
                                FROM rt_customer
                                WHERE age BETWEEN 11 AND 100
                                AND examination_date BETWEEN '$dateBegin' AND '$dateEnd'
                                GROUP BY age_range
                                ORDER BY age_range;

                                ";
                        // echo $sql;
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

        function info_customer_data()
        {
                $user =  tokenLogin($_GET["token"]);
                $data = [];
                if ($this->method == 'GET' && $user) {
                        $dateBegin = $_GET['dateBegin'];
                        $dateEnd = $_GET['dateEnd'];
                        include('connect.php');
                        $sql = "SELECT * FROM rt_customer WHERE date(examination_date) >= '$dateBegin' AND date(examination_date) <= '$dateEnd' ORDER BY examination_date DESC ";
                        // echo $sql;
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

        function info_customer_date()
        {
                $user =  tokenLogin($_GET["token"]);
                $data = [];
                if ($this->method == 'GET' && $user) {
                        include('connect.php');
                        $sql = "SELECT max(examination_date) AS date_max FROM `rt_customer` WHERE 1;";
                        // echo $sql;
                        mysqli_set_charset($conn, 'UTF8');
                        $result = $conn->query($sql);
                        if ($result->num_rows > 0) {
                                while ($row = $result->fetch_assoc()) {
                                        $data[] = $row;
                                }
                        }
                        $conn->query($sql);
                        $conn->close();

                        $this->response(200, $data[0]);
                }
        }

        function info_customer_week()
        {
                $user =  tokenLogin($_GET["token"]);
                $data = [];
                $dateBegin = $_GET['dateBegin'];
                $dateEnd = $_GET['dateEnd'];
                if ($this->method == 'GET' && $user) {
                        include('connect.php');
                        $sql = "
                                SELECT 
                                DAYNAME(examination_date) AS day_of_week,
                                ROUND(COUNT(*) / COUNT(DISTINCT DATE(examination_date)), 2) AS average_customers
                                FROM rt_customer
                                WHERE examination_date BETWEEN '$dateBegin' AND '$dateEnd'
                                GROUP BY day_of_week
                                ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

                        ";
                        // echo $sql;
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
