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


function addMonthsToCurrentDate($month)
{
        // Lấy ngày hiện tại
        $currentDate = new DateTime();

        // Cộng thêm số tháng
        $currentDate->modify("+{$month} months");

        // Định dạng lại ngày (nếu cần)
        return $currentDate->format('Y-m-d'); // Định dạng: Năm-Tháng-Ngày
}

class api extends restful_api
{
        function __construct()
        {
                parent::__construct();
        }

        function add_floow_up()
        {
                $user =  tokenLogin($_POST["token"]);
                $data = false;
                if ($this->method == 'POST' && $user) {
                        include('connect.php');
                        $op_no =  postHandleData("op_no");
                        $time =  postHandleData("time");
                        $name =  postHandleData("name");
                        $doctor_name =  postHandleData("doctor_name");
                        $service_name =  postHandleData("service_name");
                        $month =  postHandleData("month");
                        $note =  postHandleData("note");
                        $date_end = NULL;

                        // $sql = "DELETE FROM rt_floow_up WHERE op_no = '$op_no' AND DATE('$time') = DATE(time_input) AND '$time' != time_input ";
                        $sql = "DELETE FROM rt_floow_up WHERE op_no = '$op_no' AND '$time' != time_input ";
                        mysqli_set_charset($conn, 'UTF8');
                        $conn->query($sql);

                        if ($month) {
                                $date_end = addMonthsToCurrentDate($month);
                                $sql = "INSERT INTO rt_floow_up(op_no, name, doctor_name, service_name, date_end, month_up, note, time_input) VALUE ('$op_no', '$name', '$doctor_name', '$service_name', '$date_end', $month, '$note', '$time')";
                        } else {
                                $sql = "INSERT INTO rt_floow_up(op_no, name, doctor_name, service_name, note, time_input) VALUE ('$op_no', '$name', '$doctor_name', '$service_name', '$note', '$time')";
                        }

                        mysqli_set_charset($conn, 'UTF8');
                        $conn->query($sql);
                        $conn->close();
                        $data = true;
                }
                $this->response(200, $data);
        }
}

$user_api = new api();
