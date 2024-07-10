function beginApp() {
  setDate();
  infoRating();
}
beginApp();

function setDate() {
  console.log(getToday());
  if (localStorage.getItem("dateBegin")) {
    setValue("dateBegin", localStorage.getItem("dateBegin"));
  } else {
    setValue("dateBegin", getToday());
  }

  if (localStorage.getItem("dateEnd")) {
    setValue("dateEnd", localStorage.getItem("dateEnd"));
  } else {
    setValue("dateEnd", getToday());
  }
}

function getToday() {
  const today = new Date();
  // Định dạng ngày theo chuẩn yyyy-mm-dd
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
function checkColorRating(rating) {
  if (
    rating == "Rất không hài lòng" ||
    rating == "Không hài lòng" ||
    rating == "Bình thường"
  ) {
    return "red";
  }
  return "black";
}

function infoRating() {
  closeWindow("ratingDoctor");
  openTable("ratingTable");
  rattingSynthetic();
  let dateBegin = getValue("dateBegin");
  let dateEnd = getValue("dateEnd");

  localStorage.setItem("dateBegin", dateBegin);
  localStorage.setItem("dateEnd", dateEnd);

  data = {
    dateBegin,
    dateEnd,
    token,
  };
  console.log(data);
  axios
    .get(
      server + "/api/user.php/get_rating",
      { params: data },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then(function (response) {
      data = response.data;
      console.log("Check");
      console.log(data);
      var point = 0;
      document.getElementById("ratingTable").innerHTML;
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
          point += CheckPoint(value.content);
          table += `
            <tr>
              <td>${stt++}</td>
              <td>${value.zoom}</td>
              <td>${value.doctor}</td>
              <td  style = "color: ${checkColorRating(value.content)}">${
            value.content
          }</td>
              <td >${value.mess ? value.mess : ""}</td>
              <td>${value.timeInput}</td>
            </tr>
          `;
        }
      }
      let rul = (point / data.length).toFixed(2);
      document.getElementById("All").innerHTML = rul;
      document.getElementById("ratingTable").innerHTML = table;
    })
    .catch(function (error) {
      console.log(error);
      alert("Đã xảy ra lỗi!");
    });
}

function infoDoctor() {
  rattingSynthetic();
  infoRating();
  closeWindow("ratingTable");
  openTable("ratingDoctor");

  let dateBegin = getValue("dateBegin");
  let dateEnd = getValue("dateEnd");

  localStorage.setItem("dateBegin", dateBegin);
  localStorage.setItem("dateEnd", dateEnd);

  data = {
    dateBegin,
    dateEnd,
    token,
  };
  console.log(data);
  axios
    .get(
      server + "/api/user.php/get_doctor_rating",
      { params: data },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then(function (response) {
      data = response.data;
      console.log(data);
      document.getElementById("ratingTable").innerHTML;
      stt = 1;
      table = `
      <tr>
        <th>STT</th>
        <th>Bác sĩ</th>
        <th>Số lượng đánh giá</th>
        <th>Điểm</th>
        <th>Tuỳ chọn</th>
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
      document.getElementById("ratingDoctor").innerHTML = table;
    })
    .catch(function (error) {
      console.log(error);
      alert("Đã xảy ra lỗi!");
    });
}

function viewDoctor(name) {
  let dateBegin = getValue("dateBegin");
  let dateEnd = getValue("dateEnd");

  localStorage.setItem("dateBegin", dateBegin);
  localStorage.setItem("dateEnd", dateEnd);
  data = {
    dateBegin,
    dateEnd,
    name,
    token,
  };
  console.log(data);
  axios
    .get(
      server + "/api/user.php/get_view_doctor",
      { params: data },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then(function (response) {
      data = response.data;
      console.log(data);
      document.getElementById("ratingTable").innerHTML;
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
              <td>${value.mess ? value.mess : ""}</td>
              <td>${value.timeInput}</td>
            </tr>
          `;
        }
      }
      document.getElementById("view-doctor").innerHTML = table;
      openFlex("viewDoctor");
    })
    .catch(function (error) {
      console.log(error);
      alert("Đã xảy ra lỗi!");
    });
}

function rattingSynthetic() {
  let dateBegin = getValue("dateBegin");
  let dateEnd = getValue("dateEnd");
  data = {
    dateBegin,
    dateEnd,
    token,
  };
  axios
    .get(
      server + "/api/user.php/get_rating_synthetic",
      { params: data },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then(function (response) {
      data = response.data;
      console.log(data);
      for (value of data) {
        document.getElementById(value.content).innerHTML = value.quantity;
      }
    })
    .catch((error) => {
      console.log(error);
      alert("Erro");
    });
}

var contentPoint = [
  "Rất không hài lòng",
  "Không hài lòng",
  "Bình thường",
  "Hài lòng",
  "Rất hài lòng",
];

function CheckPoint(value) {
  for (let i = 0; i < 5; i++) {
    if (contentPoint[i] == value) {
      return i + 1;
    }
  }
}
