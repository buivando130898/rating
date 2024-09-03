const question = [
  {
    name: "name",
    title: "Tên khách hàng:",
    type: "text",
    answer: "",
  },
  {
    name: "op_no",
    title: "ID NURA:",
    type: "text",
    answer: "",
  },
  {
    name: "phone",
    title: "Số điện thoại liên lạc:",
    type: "text",
    answer: "",
  },
  {
    name: "mail",
    title: "ID email:",
    type: "text",
    answer: "",
  },
  {
    name: "",
    title:
      "Vui lòng cho biết mức độ hài lòng chung của bạn với chuyến thăm khám ngày hôm nay? (Điểm số cao nhất là 10)",
    type: "rating",
    answer: "",
  },
  {
    title:
      "Khả năng bạn sẽ giới thiệu chúng tôi với bạn bè? (Điểm số cao nhất là 10)",
    type: "rating",
    answer: "",
  },
  {
    title:
      "Vui lòng đề xuất cho chúng tôi bất cứ điều gì chúng tôi có thể làm để cải thiện chuyến thăm khám của bạn?",
    type: "text",
    answer: "",
  },
  {
    title: "Bạn sẽ quay lại tầm soát tại NURA?",
    type: "radio",
    answer: [
      "Có, tôi muốn quay lại NURA để sàng lọc hàng năm",
      "Không, tôi muốn đến bệnh viện hoặc trung tâm khác.",
      "Không, tôi không muốn đến nữa",
    ],
  },
  {
    title: "Nếu bạn là khách công ty, vui lòng ghi rõ tên công ty của bạn",
    type: "text",
    answer: "",
  },
  {
    title: "Bạn biết tới Nura qua cách nào?",
    type: "radio",
    answer: [
      "Người thân/Bạn bè giới thiệu trực tiếp.",
      "Facebook/ tiktok người quen.",
      "Truyền thông/báo chí/mạng xã hội TT Nura",
      "Tổng đài",
    ],
  },
];

questionBegin();
function questionBegin() {
  question_html = "";
  question.forEach((value, index) => {
    switch (value.type) {
      case "text":
        question_html += imputText(value, index);
        break;

      default:
        console.log(value.type);
        break;
    }
  });

  document.getElementById("question_content").innerHTML = question_html;
}

function imputText(value, index) {
  html_input = `
        <div class="input_general">
            <lable class="lable">${index + 1}. ${value.title}</lable>
            <input class="inputText" name="${
              value.name
            }" placeholder="Nhập câu trả lời">
        </div>
    `;
  return html_input;
}

function imputRadio(value, index) {
  html_radio = "";
  data_radio = value.answer;
  data_radio.forEach((value, index) => {
    html_radio ==
      `
        <lable class="lable_radio">${value}</lable>
        <input type="radio" id="" name="fav_language" value="HTML">
    
    `;
  });

  html_input = `
          <div class="input_general">
              <lable class="lable">${index + 1}. ${value.title}</lable>
          </div>
      `;
  return html_input;
}
