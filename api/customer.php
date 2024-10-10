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
                                        WHEN age BETWEEN 10 AND 19 THEN '10-19'
                                        WHEN age BETWEEN 20 AND 29 THEN '20-29'
                                        WHEN age BETWEEN 30 AND 39 THEN '30-39'
                                        WHEN age BETWEEN 40 AND 49 THEN '40-49'
                                        WHEN age BETWEEN 50 AND 59 THEN '50-59'
                                        WHEN age BETWEEN 60 AND 69 THEN '60-69'
                                        WHEN age BETWEEN 70 AND 79 THEN '70-79'
                                        WHEN age BETWEEN 80 AND 89 THEN '80-89'
                                        WHEN age BETWEEN 90 AND 100 THEN '90-100'
                                        ELSE 'Khác' -- Trường hợp tuổi không nằm trong khoảng từ 10 đến 100
                                END AS age_range,
                                COUNT(*) AS customer_count
                                FROM rt_customer
                                WHERE age BETWEEN 10 AND 100
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
                        $sql = "SELECT * FROM rt_customer WHERE date(examination_date) >= '$dateBegin' AND date(examination_date) <= '$dateEnd'";
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
