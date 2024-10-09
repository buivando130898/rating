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
        function get_feedback()
        {
                $user =  tokenLogin($_GET["token"]);
                $data = [];
                if ($this->method == 'GET' && $user) {
                        $dateBegin = $_GET['dateBegin'];
                        $dateEnd = $_GET['dateEnd'];
                        include('connect.php');
                        $sql = "SELECT COUNT(*) AS total_count, AVG(satisfied) AS average_satisfied, AVG(introduce) AS average_introduce FROM rt_general WHERE date(time_input) >= '$dateBegin' AND date(time_input) <= '$dateEnd'";
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

        function get_feedback_data()
        {
                $user =  tokenLogin($_GET["token"]);
                $data = [];
                if ($this->method == 'GET' && $user) {
                        $dateBegin = $_GET['dateBegin'];
                        $dateEnd = $_GET['dateEnd'];
                        include('connect.php');
                        $sql = "SELECT * FROM rt_general WHERE date(time_input) >= '$dateBegin' AND date(time_input) <= '$dateEnd'";
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

        function get_feedback_data_good()
        {
                $user =  tokenLogin($_GET["token"]);
                $data = [];
                if ($this->method == 'GET' && $user) {
                        $dateBegin = $_GET['dateBegin'];
                        $dateEnd = $_GET['dateEnd'];
                        include('connect.php');
                        $sql = "SELECT * FROM rt_general WHERE date(time_input) >= '$dateBegin' AND date(time_input) <= '$dateEnd' AND good <> '' AND good IS NOT NULL";
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

        function get_feedback_data_why()
        {
                $user =  tokenLogin($_GET["token"]);
                $data = [];
                if ($this->method == 'GET' && $user) {
                        $dateBegin = $_GET['dateBegin'];
                        $dateEnd = $_GET['dateEnd'];
                        include('connect.php');
                        $sql = "SELECT * FROM rt_general WHERE date(time_input) >= '$dateBegin' AND date(time_input) <= '$dateEnd' AND why <> '' AND why IS NOT NULL";
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

        function get_feedback_source()
        {
                $user =  tokenLogin($_GET["token"]);
                $data = [];
                if ($this->method == 'GET' && $user) {
                        $dateBegin = $_GET['dateBegin'];
                        $dateEnd = $_GET['dateEnd'];
                        include('connect.php');
                        $sql = "SELECT source, COUNT(*) AS source_count FROM rt_general WHERE time_input BETWEEN '$dateBegin' AND '$dateEnd' GROUP BY source";
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
