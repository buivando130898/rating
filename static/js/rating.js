var ratingSend = "";

function beginApp() {
  if (!localStorage["zoomName"]) {
    openFlex("ratingForm");
  } else {
    document.getElementById("zoomID").innerHTML = localStorage["zoomName"];
  }
}
beginApp();

function rating(value) {
  openFlex("conten_message");
  ratingSend = value;
}

function addRating() {
  data = {
    zoom: localStorage["zoomName"],
    content: ratingSend,
    doctor: localStorage["doctorName"],
    customer: "",
    token,
  };
  console.log(data);
  axios
    .post(server + "/api/user.php/add_rating", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      data = response.data;
      if (data == true) {
        closeWindow("conten_message");
      } else {
        console.log(data);
        alert("Đã xảy ra lỗi!");
        // closeWindow("conten_message");
      }
    })
    .catch(function (error) {
      console.log(error);
      // alert("Đã xảy ra lỗi!");
      closeWindow("conten_message");
    });
}

function addRatingInfo() {
  zoomName = getValue("zoomName");
  doctorName = getValue("doctorName");
  if (zoomName) {
    localStorage.setItem("zoomName", zoomName);
    localStorage.setItem("doctorName", doctorName);
    document.getElementById("zoomID").innerHTML = localStorage["zoomName"];
    closeWindow("ratingForm");
  } else {
    alert("Vui lòng nhập số phòng!");
  }
}

function openRatingForm() {
  setValue(
    "doctorName",
    localStorage["doctorName"] ? localStorage["doctorName"] : ""
  );
  setValue(
    "zoomName",
    localStorage["zoomName"] ? localStorage["zoomName"] : ""
  );
  openFlex("ratingForm");
}
