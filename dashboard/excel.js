var tokenlogin = localStorage['token_login'];
var data_excel;
function formatDate(dateStr) {
    try {
        // Tách ngày, tháng và năm từ chuỗi đầu vào
        const [day, month, year] = dateStr.split('/');

        // Chuyển đổi năm thành dạng 4 chữ số nếu cần
        const fullYear =
            year.length === 2
                ? parseInt(year, 10) < 50
                    ? '20' + year
                    : '19' + year
                : year;

        // Tạo đối tượng ngày với định dạng: YYYY-MM-DD
        const formattedDate = `${fullYear}-${month.padStart(
            2,
            '0'
        )}-${day.padStart(2, '0')}`;

        return formattedDate;
    } catch (error) {
        return false;
    }
}

var ExcelToJSON = function () {
    this.parseExcel = function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary',
            });
            workbook.SheetNames.forEach(function (sheetName) {
                // Here is your object
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(
                    workbook.Sheets[sheetName]
                );
                var json_object = JSON.stringify(XL_row_object);
                // console.log(JSON.parse(json_object));
                data_excel = JSON.parse(json_object);
                // console.log(data_excel);
                // jQuery('#xlx_json').val(json_object);
            });
        };
        reader.onerror = function (ex) {
            // console.log(ex);
        };
        reader.readAsBinaryString(file);
    };
};

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
}
document
    .getElementById('fileUpload')
    .addEventListener('change', handleFileSelect, false);

function convertToDate(dateString) {
    const parts = dateString.split(/[/ :]/); // Tách chuỗi theo dấu '/', khoảng trắng và ':'
    // Sắp xếp lại chuỗi với định dạng 'mm/dd/yyyy hh:mm:ss'
    return new Date(
        `${parts[1]}/${parts[0]}/${parts[2]} ${parts[3]}:${parts[4]}:${parts[5]}`
    );
}

// Update file
function upload() {
    if (confirm('Bạn có chắc chắn muốn thêm dữ liệu?')) {
        i = 0;
        max = data_excel.length;
        notification = '';
        document.getElementById(
            'import_notification'
        ).innerHTML = `<p>Vui lòng chờ đợi: ${i} / ${max}</p>`;

        const myImport = setInterval(() => {
            if (i == max) {
                console.log('notification: ');
                console.log(notification);
                if (!notification) {
                    document.getElementById('import_notification').innerHTML =
                        'Import  thành công';
                    // date_info();
                    clearInterval(myImport);
                } else {
                    document.getElementById('import_notification').innerHTML =
                        notification;
                    clearInterval(myImport);
                }
            } else {
                data = {
                    ...data_excel[i],
                    tokenlogin,
                };
                console.log(data);
                questionAll = {
                    name: data.name,
                    op_no: data.op_no,
                    phone: data.phone,
                    mail: data.mail,
                    why: data.why,
                    source: data.source,
                    good: data.good,
                    satisfied: data.satisfied,
                    introduce: data.introduce,
                    time_input: data.time_input,
                    token,
                };
                axios
                    .post(
                        server + '/api/general.php/add_general2',
                        questionAll,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    )
                    .then(function (response) {
                        data = response.data;
                        console.log(data);
                        if (data == true) {
                            noti(
                                'success',
                                'Cám ơn quý khách đã để lại đánh giá'
                            );
                        } else {
                            noti('error', 'Đã xảy ra lỗi SQL');
                        }
                    })
                    .catch(function (error) {
                        noti('error', 'Đã xảy ra lỗi hệ thống');
                    });
                i++;
                document.getElementById(
                    'import_notification'
                ).innerHTML = `<p>Vui lòng chờ đợi: ${i} / ${max}</p>`;
            }
        }, 500);
    }
}

// Update file
function upload2() {
    if (confirm('Bạn có chắc chắn muốn thêm dữ liệu?')) {
        i = 0;
        max = data_excel.length;
        notification = '';
        document.getElementById(
            'import_notification'
        ).innerHTML = `<p>Vui lòng chờ đợi: ${i} / ${max}</p>`;

        const myImport = setInterval(() => {
            if (i == max) {
                console.log('notification: ');
                console.log(notification);
                if (!notification) {
                    document.getElementById('import_notification').innerHTML =
                        'Import  thành công';
                    // date_info();
                    clearInterval(myImport);
                } else {
                    document.getElementById('import_notification').innerHTML =
                        notification;
                    clearInterval(myImport);
                }
            } else {
                data = {
                    ...data_excel[i],
                    tokenlogin,
                };

                if (formatDate(data.Date)) {
                    customerData = {
                        name: data.Name,
                        contact: data.Mobile,
                        op_no: data['OP No'],
                        examination_date: formatDate(data.Date),
                        referrer: data.Referrer,
                        gender: data.Gender,
                        age: data.Age,
                        address: data.Address,
                        remarks: data.Remarks,
                        token,
                    };
                    console.log(customerData);
                    axios
                        .post(
                            server + '/api/customer.php/add_customer',
                            customerData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            }
                        )
                        .then(function (response) {
                            data = response.data;
                            console.log(data);
                            if (data == true) {
                                noti(
                                    'success',
                                    'Cám ơn quý khách đã để lại đánh giá'
                                );
                            } else {
                                noti('error', 'Đã xảy ra lỗi SQL');
                            }
                        })
                        .catch(function (error) {
                            noti('error', 'Đã xảy ra lỗi hệ thống');
                        });
                }

                i++;
                document.getElementById(
                    'import_notification'
                ).innerHTML = `<p>Vui lòng chờ đợi: ${i} / ${max}</p>`;
            }
        }, 500);
    }
}

// Xuaats file
function ex_file_excel(name) {
    var workbook = XLSX.utils.book_new();
    var worksheet_data = document.getElementById(name);
    // console.log(worksheet_data);
    var worksheet = XLSX.utils.table_to_sheet(worksheet_data);
    workbook.SheetNames.push('Test');
    workbook.Sheets['Test'] = worksheet;
    exportExcelFile(workbook, name);
}

function exportExcelFile(workbook, name) {
    return XLSX.writeFile(workbook, name + '.xlsx');
}
