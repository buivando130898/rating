const services = [
    { name: 'Khám định kỳ', month: 0, stt: 1 },
    { name: 'XN công thức máu', month: 0 },
    { name: 'XN mỡ máu/đường máu/A. uric', month: 0 },
    { name: 'XN chức năng gan thận', month: 0 },
    { name: 'XN Hocmon tuyến giáp', month: 0 },
    { name: 'Khám chuyên khoa Huyết học', month: 0, stt: 2 },
    { name: 'Khám chuyên khoa Tim mạch', month: 0, stt: 3 },
    { name: 'Chụp cộng hưởng từ não/mạch não', month: 0 },
    { name: 'Chụp CT mạch vành', month: 0 },
    { name: 'Khám chuyên khoa nội tiết', month: 0, stt: 4 },
    { name: 'Siêu âm tuyến giáp', month: 0 },
    { name: 'Khám chuyên khoa hô hấp', month: 0, stt: 5 },
    { name: 'Chụp CT Ngực liều cực thấp tại Nura', month: 0 },
    { name: 'Chụp CT Ngực tiêm thuốc cản quang', month: 0 },
    { name: 'Ổ bụng', month: 0, stt: 6 },
    { name: 'Chụp cộng hưởng từ ổ bụng', month: 0 },
    { name: 'Chụp CLVT có tiêm thuốc cản quang', month: 0 },
    { name: 'Siêu âm ổ bụng', month: 0 },
    { name: 'Khám chuyên khoa Thận – Tiết niệu', month: 0, stt: 7 },
    { name: 'Xét nghiệm nước tiểu', month: 0 },
    { name: 'Khám chuyên khoa tiêu hóa', month: 0, stt: 8 },
    { name: 'Nội soi dạ dày', month: 0 },
    { name: 'Nội soi đại tràng', month: 0 },
    { name: 'Khám phụ khoa', month: 0, stt: 9 },
    { name: 'Làm xét nghiệm Thinprep + HPV', month: 0 },
    { name: 'Xét nghiệm tế bào', month: 0 },
    { name: 'Khám tuyến vú', month: 0, stt: 10 },
    { name: 'Siêu âm tuyến vú', month: 0 },
    { name: 'Chụp mamo tuyến vú', month: 0 },
    { name: 'Khám chuyên khoa mắt', month: 0, stt: 11 },
    { name: 'Khám cơ xương khớp', month: 0, stt: 12 },
    { name: 'Đo loãng xương', month: 0 },
    { name: 'Bổ sung vitamin D + Canxi', month: 0 },
    {
        name: 'Khám sức khỏe định kì tại NURA',
        month: 12,
        stt: 13,
        note: 'Khám định kỳ',
    },
];

console.log(services);

function handle_data_month(data, month) {
    if (data == month) {
        return 'X';
    }
    return '';
}

function handle_data(data) {
    if (data) {
        return data;
    }
    return '';
}

getFormattedDate();
function getFormattedDate() {
    const today = new Date();
    const day = today.getDate(); // Ngày
    const month = today.getMonth() + 1; // Tháng (0-11, nên cần +1)
    const year = today.getFullYear(); // Năm

    document.getElementById(
        'today'
    ).innerHTML = `Hà Nội, ngày ${day} tháng ${month} năm ${year}`;
    document.getElementById('doctor_name').value =
        localStorage.getItem('doctor_name');
}

update_floow_up();
function update_floow_up() {
    floww_up_html = `
    <tr>
        <th></th>
        <th>Nội dung</th>
        <th>< 1 tháng</th>
        <th style="min-width: 50px">3 tháng</th>
        <th style="min-width: 50px">6 tháng</th>
        <th style="min-width: 50px">1 năm</th>
        <th style="min-width: 80px">Ghi chú</th>
    </tr>
  `;

    services.forEach((value, index) => {
        floww_up_html += `
    <tr ${handle_data(value.stt) ? 'class="text_bold"' : ''}>
        <td style="width:5px" class="center">${handle_data(value.stt)}</td>
        <td>${value.name}</td>
        <td class="text_center" onclick=click_month(${index},1)>${handle_data_month(
            value.month,
            1
        )}</td>
        <td  class="text_center" onclick=click_month(${index},3)>${handle_data_month(
            value.month,
            3
        )}</td>
        <td  class="text_center" onclick=click_month(${index},6)>${handle_data_month(
            value.month,
            6
        )}</td>
        <td  class="text_center" onclick=click_month(${index},12)>${handle_data_month(
            value.month,
            12
        )}</td>
        <td onclick=click_input_text(${index}) class="text_center max_width_36">${handle_data(
            value.note
        )}</td>
    </tr>    `;
    });

    //   for (value of services) {
    //   }s
    document.getElementById('floww_up_html').innerHTML = floww_up_html;
}

var service_note = 0;
function click_input_text(service) {
    service_note = service;
    if (services[service].note) {
        document.getElementById('content_note').value = services[service].note;
    }
    document.getElementById('text_input').style.display = 'flex';
}

function click_month(service, month) {
    if (services[service].month == 0) {
        services[service].month = month;
    } else {
        services[service].month = 0;
    }
    update_floow_up();
}

fllow_up_data = true;
function print_fllow_up() {
    op_no = getValue('op_no');
    name = getValue('name');
    age = getValue('age');
    doctor_name = getValue('doctor_name');
    if (op_no && name && doctor_name && age && fllow_up_data) {
        fllow_up_data = false;
        setTimeout(() => {
            fllow_up_data = true;
        }, 2000);
        fllow_up_data = false;
        document.querySelectorAll('input').forEach((input) => {
            input.style.border = 'none'; // Xóa viền
            input.style.outline = 'none'; // Xóa đường viền focus
        });
        doctor_name = document.getElementById('doctor_name').value;
        document.getElementById('follow_up').style.textShadow = 'none';
        document.getElementById('follow_up').style.color = 'transparent';
        localStorage.setItem('doctor_name', doctor_name);

        addFollowUp();
    } else {
        alert('Vui lòng nhập đầy đủ thông tin');
    }
}

function update() {
    text_note = document.getElementById('content_note').value;
    document.getElementById('content_note').value = '';
    document.getElementById('text_input').style.display = 'none';
    services[service_note].note = text_note;
    update_floow_up();
}

async function addFollowUp() {
    console.log('Khởi động');

    // Kiểm tra xem `services` đã được định nghĩa và có giá trị hay chưa
    if (!Array.isArray(services) || services.length === 0) {
        console.error('Dịch vụ không hợp lệ hoặc không tồn tại.');
        noti('error', 'Danh sách dịch vụ trống');
        return;
    }

    // Thu thập thông tin từ giao diện
    const op_no = getValue('op_no');
    const name = getValue('name');
    const age = getValue('age');
    const doctor_name = getValue('doctor_name');
    const time = getTimestamp();

    // Kiểm tra tính hợp lệ của dữ liệu cần thiết
    if (!op_no || !name || !age || !doctor_name) {
        console.error('Thông tin bệnh nhân không đầy đủ.');
        noti('error', 'Thông tin bệnh nhân không đầy đủ');
        return;
    }

    // Duyệt qua danh sách dịch vụ và gửi yêu cầu API
    for (const value of services) {
        const data = {
            op_no,
            name,
            age,
            time,
            doctor_name,
            service_name: value.name,
            month: value.month,
            note: value.note,
            token, // Đảm bảo `token` đã được định nghĩa trước đó
        };

        try {
            const response = await axios.post(
                server + '/api/floow_up.php/add_floow_up',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data !== true) {
                console.error('SQL Error:', response.data);
                noti('error', 'Đã xảy ra lỗi SQL');
            } else {
                console.log('Thành công:', response.data);
            }
        } catch (error) {
            console.error('Hệ thống lỗi:', error);
            noti('error', 'Đã xảy ra lỗi hệ thống');
        }
    }
    setTimeout(() => {
        window.print();
    }, 1000);
}

function getTimestamp() {
    const now = new Date();

    // Lấy từng phần của thời gian
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng (0-11) + 1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Ghép thành chuỗi
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function lockClick(elementId, lockTime = 3000) {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error(`Element with ID "${elementId}" not found.`);
        return;
    }

    element.addEventListener('click', (event) => {
        // Nếu đang bị khóa, ngăn hành động mặc định
        if (element.dataset.locked === 'true') {
            event.preventDefault();
            console.log('Click is locked!');
            return;
        }

        // Khóa phần tử
        element.dataset.locked = 'true';
        console.log('Click allowed, locking now...');

        // Mở khóa sau thời gian lockTime
        setTimeout(() => {
            element.dataset.locked = 'false';
            console.log('Click unlocked!');
        }, lockTime);
    });
}

// Sử dụng hàm cho ID follow_up
// Khóa click trong 3 giây
