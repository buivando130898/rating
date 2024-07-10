var ratingSend = "";

function beginApp() {
  // if (!localStorage["zoomName"]) {
  //   openFlex("ratingForm");
  // } else {
  //   document.getElementById("zoomID").innerHTML = localStorage["zoomName"];
  // }
  checkDoctor();
}

function checkZoom() {
  data = {
    token,
  };
  // openFlex("ratingForm");
  axios
    .get(
      server + "/api/user.php/get_zoom",
      { params: data },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then(function (response) {
      data = response.data;
      for (value of data) {
        setValue(value.zoom, value.doctor);
        document.getElementById(`doctor${value.zoom}`).innerHTML = value.doctor;
      }
      // if (data.length == 0) {
      //   openFlex("ratingForm");
      // }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function checkDoctor() {
  console.log("check");
  data = {
    token,
  };
  axios
    .get(
      server + "/api/user.php/get_doctor",
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
      let doctorSelect = `<option value="">Phòng trống</option>`;
      for (value of data) {
        doctorSelect += `<option value="${value.name}">${value.name}</option>`;
      }
      document.getElementById("101").innerHTML = doctorSelect;
      document.getElementById("102").innerHTML = doctorSelect;
      document.getElementById("103").innerHTML = doctorSelect;
      document.getElementById("104").innerHTML = doctorSelect;
      checkZoom();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function optionDoctor(dt) {}

beginApp();

function updateZoom(zoomID) {
  let doctor = document.getElementById(zoomID).value;
  // if (doctor) {
  data = {
    zoomID,
    doctor,
    token,
  };
  console.log(data);
  axios
    .post(server + "/api/user.php/add_zoom", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      data = response.data;
      if (data == true) {
        // closeWindow("conten_message");
        console.log("Thành công");
      } else {
        console.log(data);
        alert("Đã xảy ra lỗi!");
        // closeWindow("conten_message");
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("Đã xảy ra lỗi!");
    });
  // }
}
function updateZoomAll() {
  updateZoom("101");
  updateZoom("102");
  updateZoom("103");
  updateZoom("104");
  checkZoom();
  alert("Thêm thông tin bác sĩ thành công!");
  closeBlock("ratingForm");
}

function rating(value) {
  // openFlex("conten_message");
  checkDoctor();
  openFlex("ratingDoctor");
  ratingSend = value;
}

function addRating() {
  data = {
    zoom: localStorage["zoomName"],
    content: ratingSend,
    mess: getValue("mess"),
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
        setTimeout(() => {
          checkZoom();
        }, 3000);
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

function addRatingInfo(zoomID) {
  zoomName = zoomID;
  doctorName = getValue(zoomID);
  document.getElementById("zoomID").innerHTML = zoomID;
  document.getElementById("zoomDoctor").innerHTML = doctorName;

  // if (doctorName) {
  localStorage.setItem("zoomName", zoomName);
  localStorage.setItem("doctorName", doctorName);
  closeWindow("ratingDoctor");
  openFlex("conten_message");
  // } else {
  //   alert("Vui lòng nhập tên bác sĩ!");
  // }
}

function openRatingForm() {
  checkZoom();
}
