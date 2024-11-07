questionAll = {
    satisfied: 10,
    introduce: 10,
};

const question = [
    {
        name: 'name',
        title: 'Name:',
        type: 'text',
        answer: '',
    },
    {
        name: 'op_no',
        title: 'NURA ID:',
        type: 'text',
        answer: '',
    },
    {
        name: 'phone',
        title: 'Contact number:',
        type: 'text',
        answer: '',
    },
    {
        name: 'mail',
        title: 'Email (as provided on ID):',
        type: 'text',
        answer: '',
    },
    {
        name: 'satisfied',
        title: 'Please indicate your overall satisfaction with our service. (0 being not satisfactory, 10 being very satisfactory.)',
        type: 'rating',
        answer: '',
    },
    {
        name: 'introduce',
        title: 'Are you likely to refer Nura to your friends and family? (0 being very unlikely; 10 being I definitely will.) ',
        type: 'rating',
        answer: '',
    },
    {
        name: 'why',
        title: 'Why do you give the above score? ',
        type: 'text',
        answer: '',
    },
    {
        name: 'good',
        title: 'What can we improve on?',
        type: 'text',
        answer: '',
    },
    {
        name: 'source',
        title: 'How did you learn about Nura?',
        type: 'radio',
        answer: [
            'Friends/family referral',
            'Company Health Checkup',
            'The Internet/Social Media/Nura’s Media campaign',
            'Other sources',
        ],
    },
];

var sourceMap = {
    'Friends/family referral': 'Người thân/bạn bè giới thiệu',
    'Company Health Checkup': 'Khám sức khỏe Công ty',
    'The Internet/Social Media/Nura’s Media campaign':
        'Internet/Mạng Xã hội/Truyền thông quảng cáo của Nura',
    'Other sources': 'Nguồn khác',
};

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
            }" placeholder="Enter answer ...">
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
    console.log(id);

    const data = document.querySelector(`input[name="${id}"]`).value;
    return data;
}

function getValueRadio(id) {
    const selectedRadio = document.querySelector(`input[name="${id}"]:checked`);

    // Lấy giá trị của radio được chọn (nếu có)
    const selectedValue = selectedRadio ? selectedRadio.value : 'Nguồn khác';

    return selectedValue;
}

function ratingConfirm() {
    name = getvalue('name');
    op_no = getvalue('op_no');
    phone = getvalue('phone');
    mail = getvalue('mail');
    why = getvalue('why');
    source = sourceMap[getValueRadio('source')];
    alert(source);
    good = getvalue('good');
    // alert(source);
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
