setMenu('general');
function beginDate() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    // Lấy thông tin năm và tháng hiện tại
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng trong JS bắt đầu từ 0, nên +1

    // Lấy ngày đầu tháng (ngày 1)
    const firstDayOfMonth = `${year}-${month}-01`;

    // Lấy ngày hiện tại
    const currentDay = String(today.getDate()).padStart(2, '0'); // Đảm bảo ngày có hai chữ số
    const currentDate = `${year}-${month}-${currentDay}`;
    setValue('monthSelect', currentMonth);
    setValue('dateBegin', firstDayOfMonth);
    setValue('dateEnd', currentDate);
}

function monthSelect(id) {
    // Lấy giá trị tháng từ phần tử có id tương ứng
    const monthData = parseInt(getValue(id), 10); // Đảm bảo monthData là số nguyên

    // Lấy năm hiện tại
    const currentYear = new Date().getFullYear();

    // Đảm bảo định dạng tháng luôn có hai chữ số (01, 02, ..., 09, 10, 11, 12)
    const formattedMonth = String(monthData).padStart(2, '0');

    // Lấy ngày đầu tháng với định dạng chuẩn `YYYY-MM-DD`
    const firstDayFormatted = `${currentYear}-${formattedMonth}-01`;

    // Tạo đối tượng Date cho ngày cuối cùng của tháng
    const lastDay = new Date(currentYear, monthData, 0); // monthData là chỉ số tháng tiếp theo
    const lastDayFormatted = `${currentYear}-${formattedMonth}-${String(
        lastDay.getDate()
    ).padStart(2, '0')}`;

    // Gán giá trị vào các trường tương ứng
    setValue('dateBegin', firstDayFormatted);
    setValue('dateEnd', lastDayFormatted);
    rattingSynthetic();
    rattingFeedback();
    info_customer();
}

function beginApp() {
    beginDate();

    rattingSynthetic();
    rattingFeedback();
    info_customer();
}

beginApp();

function getToday() {
    const today = new Date();
    // Định dạng ngày theo chuẩn yyyy-mm-dd
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
function checkColorRating(rating) {
    if (
        rating == 'Rất không hài lòng' ||
        rating == 'Không hài lòng' ||
        rating == 'Bình thường'
    ) {
        return 'red';
    }
    return 'black';
}

function rattingSynthetic() {
    point_reset();
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');
    data = {
        dateBegin,
        dateEnd,
        token,
    };
    axios
        .get(
            server + '/api/user.php/get_rating_synthetic',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            data = response.data;
            console.log('Check: ... ');

            console.log(data);
            let sl = 0;
            let point = 0;
            for (value of data) {
                document.getElementById(value.content).innerHTML =
                    value.quantity;
                sl += Number(value.quantity);
                point += value.quantity * CheckPoint(value.content);
            }
            console.log(point);

            document.getElementById('Số lượng đánh giá').innerHTML = sl;
            document.getElementById('Điểm trung bình').innerHTML = (
                point / sl
            ).toFixed(2);
        })
        .catch((error) => {
            console.log(error);
            alert('Erro 222');
        });
}

var contentPoint = [
    'Rất không hài lòng',
    'Không hài lòng',
    'Bình thường',
    'Hài lòng',
    'Rất hài lòng',
];

function point_reset() {
    var contentPoint = [
        'Rất không hài lòng',
        'Không hài lòng',
        'Bình thường',
        'Hài lòng',
        'Rất hài lòng',
    ];
    for (let value of contentPoint) {
        document.getElementById(value).innerHTML = 0;
    }
}

function CheckPoint(value) {
    for (let i = 0; i < 5; i++) {
        if (contentPoint[i] == value) {
            return i + 1;
        }
    }
}

function update_Data() {
    rattingSynthetic();
    rattingFeedback();
    info_customer();
}

//
function infoRating() {
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');
    data = {
        dateBegin,
        dateEnd,
        token,
    };
    axios
        .get(
            server + '/api/user.php/get_rating',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            data = response.data;
            stt = 1;
            table = `
      <tr>
        <th>STT</th>
        <th>Bác sĩ</th>
        <th>Đánh giá</th>
        <th>Góp ý</th>
        <th>Thời gian</th>
      </tr>
      `;

            if (data.length > 0) {
                for (value of data) {
                    table += `
            <tr>
              <td>${stt++}</td>
              <td>${value.doctor}</td>
              <td  style = "color: ${checkColorRating(value.content)}">${
                        value.content
                    }</td>
              <td >${value.mess ? value.mess : ''}</td>
              <td>${value.timeInput}</td>
            </tr>
          `;
                }
            }
            document.getElementById('title_form').innerHTML =
                'Danh sách khách đánh giá bác sĩ:';
            document.getElementById('viewDoctor').style.display = 'flex';
            document.getElementById('view-doctor').innerHTML = table;
        })
        .catch(function (error) {
            console.log(error);
            alert('Đã xảy ra lỗi!');
        });
}

//
function infoFeedback() {
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');
    data = {
        dateBegin,
        dateEnd,
        token,
    };
    axios
        .get(
            server + '/api/feedback.php/get_feedback_data',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            data = response.data;
            console.log(data);

            stt = 1;
            table = `
      <tr>
        <th>STT</th>
        <th>Khách hàng</th>
        <th>Mức độ hài lòng</th>
        <th>Khả năng giới thiệu</th>
        <th>Vì sao cho điểm số kia</th>
        <th style="max-width: 400px">Góp ý thay đổi</th>
        <th>Nguồn</th>
        <th>Thời gian</th>
      </tr>
      `;

            if (data.length > 0) {
                for (value of data) {
                    table += `
            <tr>
              <td>${stt++}</td>
              <td>${value.name}</td>
              <td>${value.satisfied}</td>
              <td>${value.introduce}</td>
              <td>${value.why}</td>
              <td>${value.good}</td>
              <td>${value.source}</td>
              <td>${value.time_input}</td>
            </tr>
          `;
                }
            }
            document.getElementById('title_form').innerHTML =
                'Danh sách khách hàng Feedback:';
            document.getElementById('viewDoctor').style.display = 'flex';
            document.getElementById('view-doctor').innerHTML = table;
        })
        .catch(function (error) {
            console.log(error);
            alert('Đã xảy ra lỗi!');
        });
}

function infoFeedback_good() {
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');
    data = {
        dateBegin,
        dateEnd,
        token,
    };
    axios
        .get(
            server + '/api/feedback.php/get_feedback_data_good',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            data = response.data;
            console.log(data);

            stt = 1;
            table = `
      <tr>
        <th>STT</th>
        <th>Khách hàng</th>
        <th>Mức độ hài lòng</th>
        <th>Khả năng giới thiệu</th>
        <th>Vì sao cho điểm số kia</th>
        <th style="max-width: 400px">Góp ý thay đổi</th>
        <th>Nguồn</th>
        <th>Thời gian</th>
      </tr>
      `;

            if (data.length > 0) {
                for (value of data) {
                    table += `
            <tr>
              <td>${stt++}</td>
              <td>${value.name}</td>
              <td>${value.satisfied}</td>
              <td>${value.introduce}</td>
              <td>${value.why}</td>
              <td  style="color: red">${value.good}</td>
              <td>${value.source}</td>
              <td>${value.time_input}</td>
            </tr>
          `;
                }
            }
            document.getElementById('viewDoctor').style.display = 'flex';
            document.getElementById('view-doctor').innerHTML = table;
        })
        .catch(function (error) {
            console.log(error);
            alert('Đã xảy ra lỗi!');
        });
}

function infoFeedback_why() {
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');
    data = {
        dateBegin,
        dateEnd,
        token,
    };
    axios
        .get(
            server + '/api/feedback.php/get_feedback_data_why',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            data = response.data;
            console.log(data);

            stt = 1;
            table = `
      <tr>
        <th>STT</th>
        <th>Khách hàng</th>
        <th>Mức độ hài lòng</th>
        <th>Khả năng giới thiệu</th>
        <th>Vì sao cho điểm số kia</th>
        <th  style="max-width: 400px">Góp ý thay đổi</th>
        <th>Nguồn</th>
        <th>Thời gian</th>
      </tr>
      `;

            if (data.length > 0) {
                for (value of data) {
                    table += `
            <tr>
              <td>${stt++}</td>
              <td>${value.name}</td>
              <td>${value.satisfied}</td>
              <td>${value.introduce}</td>
              <td style="color: #007BFF">${value.why}</td>
              <td>${value.good}</td>
              <td>${value.source}</td>
              <td>${value.time_input}</td>
            </tr>
          `;
                }
            }
            document.getElementById('viewDoctor').style.display = 'flex';
            document.getElementById('view-doctor').innerHTML = table;
        })
        .catch(function (error) {
            console.log(error);
            alert('Đã xảy ra lỗi!');
        });
}

function setValue_0() {
    let contentPointData = [
        'Số lượng đánh giá',
        'Điểm trung bình',
        'Rất không hài lòng',
        'Không hài lòng',
        'Bình thường',
        'Hài lòng',
        'Rất hài lòng',
        'Số lượng Feedback',
        'Mức độ hài lòng',
        'Khả năng giới thiệu',
        'Người thân/bạn bè giới thiệu',
        'Internet/Mạng Xã hội/Truyền thông quảng cáo của Nura',
        'Trực tiếp từ Bảng biển ngoài phòng khám',
        'Nguồn khác',
    ];
    for (value of contentPointData) {
        document.getElementById(value).innerHTML = 0;
    }
}

function infoRatingPoint(point) {
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');
    data = {
        point,
        dateBegin,
        dateEnd,
        token,
    };
    axios
        .get(
            server + '/api/user.php/get_rating_point',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            data = response.data;
            stt = 1;
            table = `
      <tr>
        <th>STT</th>
        <th>Bác sĩ</th>
        <th>Đánh giá</th>
        <th>Góp ý</th>
        <th>Thời gian</th>
      </tr>
      `;
            if (data.length > 0) {
                for (value of data) {
                    table += `
            <tr>
              <td>${stt++}</td>
              <td>${value.doctor}</td>
              <td  style = "color: ${checkColorRating(value.content)}">${
                        value.content
                    }</td>
              <td >${value.mess ? value.mess : ''}</td>
              <td>${value.timeInput}</td>
            </tr>
          `;
                }
            }
            console.log(table);
            document.getElementById('title_form').innerHTML =
                'Danh sách khách hàng:';
            document.getElementById('viewDoctor').style.display = 'flex';
            document.getElementById('view-doctor').innerHTML = table;
        })
        .catch(function (error) {
            console.log(error);
            alert('Đã xảy ra lỗi!');
        });
}

function getColor(id) {
    value = document.getElementById(id).innerHTML;
    if (value) {
        console.log('Yes');
        return Number(value);
    } else {
        document.getElementById(id).innerHTML = 0;
        console.log('No');
        return 0;
    }
}
var referralChart;
function rattingFeedback() {
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');
    data = {
        dateBegin,
        dateEnd,
        token,
    };
    axios
        .get(
            server + '/api/feedback.php/get_feedback_source',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            referralData = response.data;
            console.log(referralData);
            if (!referralData.length) return false;
            const labels = referralData.map((item) => item.source);
            const data = referralData.map((item) =>
                parseInt(item.source_count, 10)
            ); // Chuyển đổi thành số nguyên

            // Tự động sinh màu cho mỗi phần của biểu đồ
            const backgroundColors = [
                'rgba(39, 170, 225, 0.7)',
                'rgba(61, 86, 106, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
            ];

            const borderColors = [
                'rgba(39, 170, 225, 0.7)',
                'rgba(61, 86, 106, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
            ];

            let labels_chart = '';
            referralData.forEach((value, index) => {
                labels_chart += `
                <p class = "labale_div">
                    <span class="block_color" style = "background-color: ${borderColors[index]}"></span>
                    ${value.source}
                </p>
            `;
            });

            document.getElementById('labels_chart').innerHTML = labels_chart;
            // Cấu hình biểu đồ
            const ctx = document
                .getElementById('referralChart')
                .getContext('2d');

            if (referralChart) {
                referralChart.destroy();
            }
            referralChart = new Chart(ctx, {
                type: 'pie', // Biểu đồ hình tròn
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: data,
                            backgroundColor: backgroundColors.slice(
                                0,
                                referralData.length
                            ), // Lấy số màu tương ứng với số lượng nguồn
                            borderColor: borderColors.slice(
                                0,
                                referralData.length
                            ), // Lấy số viền tương ứng
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    plugins: {
                        legend: {
                            display: false, // Không hiển thị legend
                            labels: {
                                font: {
                                    size: 14,
                                },
                                overflow: 'auto',
                                color: '#333',
                                padding: 20, // Tăng khoảng cách giữa các nhãn
                            },
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    const total = data.reduce(
                                        (acc, val) => acc + val,
                                        0
                                    );
                                    const currentValue = tooltipItem.raw;
                                    const percentage = (
                                        (currentValue / total) *
                                        100
                                    ).toFixed(2);
                                    // return ` ${currentValue} (${percentage}%)`;
                                    return `SL: ${currentValue} (${percentage}%)`;
                                },
                            },
                        },
                    },
                    layout: {
                        padding: 20,
                        overflow: 'auto',
                    },
                },
            });
        })
        .catch((error) => {
            console.log(error);
            alert('Erro');
        });

    axios
        .get(
            server + '/api/feedback.php/get_feedback',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            data = response.data;
            console.log('Feedback hướng dẫn');
            console.log(data);
            document.getElementById('Số lượng Feedback').innerHTML =
                data.total_count;
            document.getElementById('Mức độ hài lòng').innerHTML = Number(
                data.average_satisfied
            ).toFixed(2);
            document.getElementById('Khả năng giới thiệu').innerHTML = Number(
                data.average_introduce
            ).toFixed(2);
        })
        .catch((error) => {
            console.log(error);
            alert('Erro');
        });
}

function infoDoctor() {
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');

    data = {
        dateBegin,
        dateEnd,
        token,
    };
    console.log(data);
    axios
        .get(
            server + '/api/user.php/get_doctor_rating',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            data = response.data;
            console.log(data);
            document.getElementById('view-doctor').innerHTML;
            stt = 1;
            table = `
      <tr>
        <th>STT</th>
        <th>Bác sĩ</th>
        <th>Số lượng đánh giá</th>
        <th>Điểm</th>
        <th>Tùy chỉnh</th>
      </tr>
      `;
            if (data.length > 0) {
                for (value of data) {
                    table += `
            <tr>
              <td>${stt++}</td>
              <td>${value.doctor}</td>
              <td>${value.countDoctor}</td>
              <td>${value.pointAVG}</td>
            <td><button onclick="viewDoctor('${
                value.doctor
            }')">Xem</button></td>
            </tr>
          `;
                }
            }
            document.getElementById('title_form').innerHTML =
                'Danh sách thông tin bác sĩ:';
            document.getElementById('view-doctor').innerHTML = table;
            document.getElementById('viewDoctor').style.display = 'flex';
        })
        .catch(function (error) {
            console.log(error);
            alert('Đã xảy ra lỗi!');
        });
}

function info_customer() {
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');
    info_customer_age();
    info_customer_week();

    data = {
        dateBegin,
        dateEnd,
        token,
    };
    console.log(data);
    axios
        .get(
            server + '/api/customer.php/get_info_customer',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            data = response.data;
            console.log(data);
            document.getElementById('Số lượng khách hàng').innerHTML =
                data.total_customers;
            document.getElementById('Khách nam').innerHTML =
                data.male_customers;
            document.getElementById('Khách nữ').innerHTML =
                data.female_customers;
        })
        .catch(function (error) {
            console.log(error);
            alert('Đã xảy ra lỗi!');
        });
}

function viewDoctor(name) {
    document.getElementById('view-doctor2').innerHTML = '';
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');

    localStorage.setItem('dateBegin', dateBegin);
    localStorage.setItem('dateEnd', dateEnd);
    data = {
        dateBegin,
        dateEnd,
        name,
        token,
    };
    console.log(data);
    axios
        .get(
            server + '/api/user.php/get_view_doctor',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            data = response.data;
            console.log(data);
            // document.getElementById('ratingTable').innerHTML;
            stt = 1;
            table = `
                    <tr>
                        <th>STT</th>
                        <th>Phòng</th>
                        <th>Bác sĩ</th>
                        <th>Đánh giá</th>
                        <th>Góp ý</th>
                        <th>Thời gian</th>
                    </tr>
                    `;
            if (data.length > 0) {
                for (value of data) {
                    table += `
            <tr>
              <td>${stt++}</td>
              <td>${value.zoom}</td>
              <td>${value.doctor}</td>
              <td>${value.content}</td>
              <td>${value.mess ? value.mess : ''}</td>
              <td>${value.timeInput}</td>
            </tr>
          `;
                }
            }
            document.getElementById('view-doctor2').innerHTML = table;
            openFlex('viewDoctor2');
        })
        .catch(function (error) {
            console.log(error);
            alert('Đã xảy ra lỗi!');
        });
}

var ageChart;

function info_customer_age() {
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');

    data = {
        dateBegin,
        dateEnd,
        token,
    };
    console.log(data);
    axios
        .get(
            server + '/api/customer.php/get_customer_age',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            const ageDataFromDB = response.data;
            // Chuyển đổi dữ liệu thành định dạng phù hợp cho biểu đồ
            const labels = ageDataFromDB.map((item) => item.age_range); // Lấy nhãn độ tuổi
            const data = ageDataFromDB.map((item) =>
                parseInt(item.customer_count)
            ); // Lấy số lượng khách hàng

            // Cấu hình dữ liệu biểu đồ
            const ageData = {
                labels: labels, // Nhãn độ tuổi
                datasets: [
                    {
                        label: 'Số lượng người theo độ tuổi',
                        data: data, // Dữ liệu số lượng
                        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Màu nền cột
                        borderColor: 'rgba(54, 162, 235, 1)', // Màu viền cột
                        borderWidth: 1, // Độ dày viền
                    },
                ],
            };

            // Cấu hình biểu đồ
            const config = {
                type: 'bar', // Kiểu biểu đồ cột
                data: ageData,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true, // Bắt đầu trục Y từ số 0
                        },
                    },
                },
            };

            if (ageChart) {
                ageChart.destroy();
            }

            // Tạo biểu đồ
            ageChart = new Chart(document.getElementById('ageChart'), config);
        })
        .catch(function (error) {
            console.log(error);
            alert('Đã xảy ra lỗi!1');
        });
}
var customerChart;

function info_customer_week() {
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');

    data = {
        dateBegin,
        dateEnd,
        token,
    };
    console.log(data);
    axios
        .get(
            server + '/api/customer.php/info_customer_week',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            const data = response.data;
            view_chart_customer_week(data);
        })
        .catch(function (error) {
            console.log(error);
            alert('Đã xảy ra lỗi!1');
        });
}

function view_chart_customer_week(data_week) {
    console.log('Check');

    console.log(data_week);

    // Dữ liệu mẫu từ câu truy vấn SQL
    const labels = [
        'Thứ Hai',
        'Thứ Ba',
        'Thứ Tư',
        'Thứ Năm',
        'Thứ Sáu',
        'Thứ Bảy',
        'Chủ Nhật',
    ];
    const data = [0, 0, 0, 0, 0, 0, 0]; // Dữ liệu trung bình số lượng khách hàng theo ngày
    data_week.forEach((item) => {
        switch (item.day_of_week) {
            case 'Monday':
                data[0] = parseInt(item.average_customers, 10);
                break;
            case 'Tuesday':
                data[1] = parseInt(item.average_customers, 10);
                break;
            case 'Wednesday':
                data[2] = parseInt(item.average_customers, 10);
                break;
            case 'Thursday':
                data[3] = parseInt(item.average_customers, 10);
                break;
            case 'Friday':
                data[4] = parseInt(item.average_customers, 10);
                break;
            case 'Saturday':
                data[5] = parseInt(item.average_customers, 10);
                break;
            case 'Sunday':
                data[6] = parseInt(item.average_customers, 10);
                break;
        }
    });
    // Cấu hình biểu đồ
    const ctx = document.getElementById('customerChart').getContext('2d');
    if (customerChart) {
        customerChart.destroy();
    }
    customerChart = new Chart(ctx, {
        type: 'bar', // Biểu đồ dạng cột
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Trung bình số lượng khách ',
                    data: data,
                    backgroundColor: 'rgba(61, 86, 106, 0.5)', // Màu nền cột
                    borderColor: 'rgba(61, 86, 106, 1)', // Màu viền cột
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        },
    });
}

function info_customer_data() {
    let dateBegin = getValue('dateBegin');
    let dateEnd = getValue('dateEnd');

    data = {
        dateBegin,
        dateEnd,
        token,
    };
    console.log(data);
    axios
        .get(
            server + '/api/customer.php/info_customer_data',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            data = response.data;
            console.log(data);
            document.getElementById('view-doctor').innerHTML;
            stt = 1;
            table = `
      <tr>
        <th>STT</th>
        <th>Khách hàng</th>
        <th>Ngày khám</th>
        <th>Referrer</th>
        <th>Giới tính</th>
        <th>số tuổi</th>
        <th>Quê quán</th>

      </tr>
      `;
            if (data.length > 0) {
                for (value of data) {
                    table += `
            <tr>
              <td>${stt++}</td>
              <td>${value.name}</td>
              <td>${value.examination_date}</td>
              <td>${value.referrer}</td>
              <td>${value.gender}</td>
              <td>${value.age}</td>
              <td>${value.address}</td>
            </tr>
          `;
                }
            }
            document.getElementById('view-doctor').innerHTML = table;
            document.getElementById('viewDoctor').style.display = 'flex';
        })
        .catch(function (error) {
            console.log(error);
            alert('Đã xảy ra lỗi!');
        });
}

info_customer_date();
function info_customer_date() {
    data = {
        token,
    };
    console.log(data);
    axios
        .get(
            server + '/api/customer.php/info_customer_date',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(function (response) {
            data = response.data;
            console.log(data);
            document.getElementById('date_late').innerHTML = data.date_max;
        })
        .catch(function (error) {
            console.log(error);
            alert('Đã xảy ra lỗi!');
        });
}
