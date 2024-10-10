questionAll = {
    satisfied: 10,
    introduce: 10,
};

const question = [
    {
        name: 'name',
        title: 'Tên khách hàng:',
        type: 'text',
        answer: '',
    },
    {
        name: 'op_no',
        title: 'ID NURA:',
        type: 'text',
        answer: '',
    },
    {
        name: 'phone',
        title: 'Số điện thoại liên lạc:',
        type: 'text',
        answer: '',
    },
    {
        name: 'mail',
        title: 'ID email:',
        type: 'text',
        answer: '',
    },
    {
        name: 'satisfied',
        title: 'Vui lòng cho biết mức độ hài lòng chung của bạn với dịch vụ của chúng tôi. (từ 0-10)',
        type: 'rating',
        answer: '',
    },
    {
        name: 'introduce',
        title: 'Nếu chấm điểm sự sẵn lòng giới thiệu Nura cho bạn bè, gia đình và người quen, thì bạn sẽ cho Nura mấy điểm? (từ 0-10)',
        type: 'rating',
        answer: '',
    },
    {
        name: 'why',
        title: 'Vì sao bạn cho số điểm trên?',
        type: 'text',
        answer: '',
    },
    {
        name: 'good',
        title: 'Để phục vụ bạn được tốt hơn, theo bạn chúng tôi cần phải làm gì??',
        type: 'text',
        answer: '',
    },
    {
        name: 'source',
        title: 'Bạn biết đến NURA từ nguồn thông tin nào?',
        type: 'radio',
        answer: [
            'Người thân/bạn bè giới thiệu',
            'Khám sức khỏe Công ty',
            'Internet/Mạng Xã hội/Truyền thông quảng cáo của Nura',
            'Nguồn khác',
        ],
    },
];

questionBegin();
function questionBegin() {
    question_html = '';
    question.forEach((value, index) => {
        switch (value.type) {
            case 'text':
                question_html += inputText(value, index);
                break;

            case 'rating':
                question_html += inputRating(value, index);
                break;

            case 'radio':
                question_html += inputRadio(value, index);
                break;

            default:
                console.log(value.type);
                break;
        }
    });

    document.getElementById('question_content').innerHTML = question_html;
}

function getValueQues(ques, point) {
    document.getElementById(ques + questionAll[ques]).style.backgroundColor =
        '#f0f0f0f0';
    questionAll = {
        ...questionAll,
        [ques]: point,
    };
    document.getElementById(ques + point).style.backgroundColor = '#fac141';
}

function inputText(value, index) {
    html_input = `
        <div class="input_general">
            <lable class="lable">${index + 1}. ${value.title}</lable>
            <input class="inputText" autocomplete="off" name="${
                value.name
            }" placeholder="Nhập câu trả lời">
        </div>
    `;
    return html_input;
}

function inputRadio(value, index) {
    answerHTML = '';
    dataAnswer = value.answer;
    for (answerValue of dataAnswer) {
        answerHTML += `
        <div class = "radio_input">
          <input type="radio" id="${answerValue}" name="${value.name}" value="${answerValue}">
          <label for="${answerValue}">${answerValue}</label><br>
        </div>
        `;
    }

    html_input = `
      <div class="input_general ">
          <lable class="lable">${index + 1}. ${value.title}</lable>
            ${answerHTML}
      </div>
    `;

    return html_input;
}

function inputRating(value, index) {
    buttonSelect = '';
    for (i = 0; i <= 10; i++) {
        buttonSelect += `
      <button onclick="getValueQues('${value.name}', ${i})" class="ques" id="${
            value.name + i
        }" >${i}</button>
    `;
    }

    html_input = `
        <div class="input_general">
            <lable class="lable">${index + 1}. ${value.title}</lable>
            <div class="ques_all">
              ${buttonSelect}
            </div>

        </div>
    `;
    return html_input;
}

function check() {
    console.log(questionAll);
}

function getvalue(id) {
    const data = document.querySelector(`input[name="${id}"]`).value;
    return data;
}

function ratingConfirm() {
    name = getvalue('name');
    op_no = getvalue('op_no');
    phone = getvalue('phone');
    mail = getvalue('mail');
    why = getvalue('why');
    source = getvalue('source');
    good = getvalue('good');
    questionAll = {
        ...questionAll,
        name,
        op_no,
        phone,
        mail,
        why,
        source,
        good,
        token,
    };
    console.log(questionAll);

    if (name) {
        axios
            .post(server + '/api/general.php/add_general', questionAll, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(function (response) {
                data = response.data;
                console.log(data);
                if (data == true) {
                    noti('success', 'Cám ơn quý khách đã để lại đánh giá');
                    setTimeout(function () {
                        location.reload();
                    }, 3000);
                } else {
                    noti('error', 'Đã xảy ra lỗi SQL');
                }
            })
            .catch(function (error) {
                noti('error', 'Đã xảy ra lỗi hệ thống');
            });
    } else {
        alert('Vui lòng nhấp đầy đủ thông tin');
        noti('error', 'Vui lòng nhấp đầy đủ thông tin');
    }
}