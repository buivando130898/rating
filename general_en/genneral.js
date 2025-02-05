questionAll = {
    satisfied: 10,
    introduce: 10,
};

const question = [
    {
        name: 'room',
        title: 'Which consultation room did you visit?',
        type: 'select',
        answer: ['101', '102', '103', '104'],
    },
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
    // {
    //     name: 'phone',
    //     title: 'Contact number:',
    //     type: 'text',
    //     answer: '',
    // },
    // {
    //     name: 'mail',
    //     title: 'Email (as provided on ID):',
    //     type: 'text',
    //     answer: '',
    // },
    {
        name: 'satisfied',
        title: 'Please indicate your overall satisfaction with our service. (0 being not satisfactory, 10 being very satisfactory.)',
        type: 'rating',
        answer: '',
    },

    {
        name: 'rating',
        title: 'Were you satisfied with the consultation with the doctor:',
        type: 'star',
        answer: [
            'Very satisfied',
            'Satisfied',
            'Neutral',
            'Dissatisfied',
            'Very dissatisfied',
        ],
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
        type: 'textarea',
        answer: '',
    },
    {
        name: 'good',
        title: 'What can we improve on?',
        type: 'textarea',
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
    'Very satisfied': 'Rất hài lòng',
    Satisfied: 'Hài lòng',
    Neutral: 'Bình thường',
    Dissatisfied: 'Không hài lòng',
    'Very dissatisfied': 'Rất không hài lòng',
};

checkZoom = [];
getZoom();
function getZoom() {
    data = {
        token,
    };
    // openFlex("ratingForm");
    axios
        .get(
            server + '/api/user.php/get_zoom',
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
            for (value of data) {
                checkZoom[value.zoom] = value.doctor;
            }
            questionBegin();
        })
        .catch(function (error) {
            console.log(error);
        });
}

function questionBegin() {
    question_html = '';
    question.forEach((value, index) => {
        switch (value.type) {
            case 'text':
                question_html += inputText(value, index);
                break;

            case 'textarea':
                question_html += inputTextarea(value, index);
                break;

            case 'rating':
                question_html += inputRating(value, index);
                break;

            case 'radio':
                question_html += inputRadio(value, index);
                break;

            case 'select':
                question_html += inputSelect(value, index);
                break;

            case 'star':
                question_html += inputStar(value, index);
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

function inputStar(value, index) {
    html_input = `
        <div class="input_general">
            <lable class="lable">${index + 1}. ${value.title}</lable>
            <div class="ratingStar">
                <input type="radio" name="${
                    value.name
                }" id="star5" value="Very satisfied" />
                <label for="star5">&#9733;</label>
                <input type="radio" name="${
                    value.name
                }" id="star4" value="Satisfied" />
                <label for="star4">&#9733;</label>
                <input type="radio" name="${
                    value.name
                }" id="star3" value="Neutral" />
                <label for="star3">&#9733;</label>
                <input type="radio" name="${
                    value.name
                }" id="star2" value="Dissatisfied" />
                <label for="star2">&#9733;</label>
                <input type="radio" name="${
                    value.name
                }" id="star1" value="Very dissatisfied" />
                <label for="star1">&#9733;</label>
            </div>
        </div>

        `;
    return html_input;
}

function inputTextarea(value, index) {
    html_input = `
        <div class="input_general">
            <lable class="lable">${index + 1}. ${value.title}</lable>
            <textarea class="inputTextarea" rows="3" id="${value.name}" name="${
        value.name
    }" placeholder="Enter answer ..."></textarea>
        </div>
    `;
    return html_input;
}

function inputSelect(value, index) {
    answerHTML = '';
    dataAnswer = value.answer;
    for (answerValue of dataAnswer) {
        answerHTML += `
                <option value="${answerValue}">Room ${answerValue} - ${checkZoom[answerValue]}</option>
        `;
    }

    html_input = `
      <div class="input_general ">
            <lable class="lable">${index + 1}. ${value.title}</lable>
            <select class="inputText" name="${value.name}" id="${value.name}">
                ${answerHTML}
            </select>
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
    // phone = getvalue('phone');
    // mail = getvalue('mail');
    why = getValue('why');
    source = sourceMap[getValueRadio('source')];
    // alert(source);
    good = getValue('good');
    // alert(source);
    questionAll = {
        ...questionAll,
        name,
        op_no,
        // phone,
        // mail,
        why,
        source,
        good,
        token,
    };
    console.log(questionAll);

    if (name && op_no) {
        addRating();
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

function addRating() {
    data = {
        zoom: getValue('room'),
        content: sourceMap[getValueRadio('rating')],
        mess: '',
        doctor: checkZoom[getValue('room')],
        customer: getvalue('op_no'),
        token,
    };
    console.log(data);
    axios
        .post(server + '/api/user.php/add_rating', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(function (response) {
            data = response.data;
            if (data == true) {
                console.log('Done');
            } else {
                console.log(data);
                alert('Đã xảy ra lỗi!');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}
