function beginApp() {
  setDate();
  infoRating();
}
beginApp();

function setDate() {
  console.log(getToday());
  setValue("dateBegin", getToday());
  setValue("dateEnd", getToday());
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

function infoRating() {
  let dateBegin = getValue("dateBegin");
  let dateEnd = getValue("dateEnd");
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

      document.getElementById("ratingTable").innerHTML;
      stt = 0;
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
              <td>${value.mess}</td>
              <td>${value.timeInput}</td>
            </tr>
          `;
        }
      }
      document.getElementById("ratingTable").innerHTML = table;
    })
    .catch(function (error) {
      console.log(error);
      alert("Đã xảy ra lỗi!");
    });
}
