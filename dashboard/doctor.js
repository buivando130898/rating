setMenu("doctor");
var materials = [
    {
        name: 'Tên bác sĩ',
        type: 'text',
        id: 'name',
    },
    {
        name: 'Chức vụ nhiệm vụ',
        type: 'text',
        id: 'office'
    },
    {
        name: 'Ghi chú',
        type: 'text',
        id: 'note'
    },
]


function openAdd() {
    var itemDisplay = '';
    for(value of materials) {
        if(value.type != 'select') {
            itemDisplay +=
            `
                <div class='form_input_item'>
                    <label class="input__label" for="${value.name}">${value.name} :</label>
                    <input class="input__style" type="${value.type}" name="${value.name}" value="" id="${value.id}">
                </div>
            `
        } else {
            option ="";
            for(op of value.value) {
                option += 
                `
                    <option value="${op}">${op}</option>
                `
            }

            itemDisplay += 
            `
                <div class='form_input_item'>
                    <label class="input__label" for="${value.name}">${value.name} :</label>
                    <select  class="input__style" id="${value.id}">
                        ${option}
                    </select>
                </div>
            `
        }

    }
    itemDisplay +=
    `
        <div class='form_input_item'>
            <button class = 'btn' onclick = "addItem()"> Xác nhận </button>
        </div>
    `
    document.getElementById('form_input').innerHTML = itemDisplay;
    openFlex("form");
}

function addItem() {
    name = getValue('name');
    office = getValue('office');
    note  = getValue('note');
    data = {
        name,
        office,
        note,
        token
    }
    if(name && office) {
        axios
        .post(server + '/api/room.php/add_doctor', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(function (response) {
            data = response.data;
            console.log(data);
            if (data == true) {
                getItem();
                noti('success', 'Thêm thông tin bác sĩ thành công');
                closeWindow('form');
            } else {
                noti('error', 'Đã xảy ra lỗi sql');
            }
        })
        .catch(function (error) {
            noti('error', 'Đã xảy ra lỗi hệ thống');
        });
    } else {
        noti('error', 'Vui lòng nhấp đầy đủ thông tin');
    }

}

function delete_doctor(id) {
    var confirmDelete = confirm("Bạn có chắc chắn muốn xóa dữ liệu này không?");
    if (confirmDelete) {
        data = {
            id,
            token
        }
        if(id) {
            axios
            .post(server + '/api/room.php/delete_doctor', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(function (response) {
                data = response.data;
                console.log(data);
                if (data == true) {
                    getItem();
                    noti('success', 'Đã xóa thông tin bác sĩ');
                    closeWindow('form');
                } else {
                    noti('error', 'Đã xảy ra lỗi sql');
                }
            })
            .catch(function (error) {
                noti('error', 'Đã xảy ra lỗi hệ thống');
            });
        } else {
            noti('error', 'Vui lòng nhấp đầy đủ thông tin');
        }
    }

}


getItem();
function getItem() {
    data = {
        token
    };
    axios
        .get(
            server + '/api/room.php/get_doctor',
            { params: data },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        )
        .then(function (response) {
            data = response.data;
            console.log(data);
            if (data.length) {
                table = `
                        <tr>
                            <th  style="min-width: 50px"> STT </th>
                            <th  style="min-width: 150px">Tên bác sĩ</th>
                            <th  style="min-width: 150px">Chức vụ Nhiệm vụ</th>
                            <th  style="min-width: 150px">Ghi chú</th>
                            <th  style="min-width: 150px">Chỉnh sửa</th>
                        </tr>
                    `;
                data.map((value, index) => {
                    table += 
                    `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${value.name}</td>
                            <td>${check_value(value.office)}</td>
                            <td>${check_value(value.note)}</td>
                            <td>
                                <button onclick="delete_doctor('${value.id}')">Xóa</button>
                            </td>
                        </tr>
                    `
                
                });
                document.getElementById('item_info').innerHTML = table;
            } else {
                document.getElementById('item_info').innerHTML = '';
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}