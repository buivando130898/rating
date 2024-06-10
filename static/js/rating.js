var ratingSend = "";

function beginApp() {
  // if (!localStorage["zoomName"]) {
  //   openFlex("ratingForm");
  // } else {
  //   document.getElementById("zoomID").innerHTML = localStorage["zoomName"];
  // }
  checkZoom();
}

function checkZoom() {
  data = {
    token,
  };
  openFlex("ratingForm");
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
        console.log(value);
        setValue(value.zoom, value.doctor);
      }
      // if (data.length == 0) {
      //   openFlex("ratingForm");
      // }
    })
    .catch(function (error) {
      console.log(error);
    });
}

beginApp();

function updateZoom(zoomID) {
  let doctor = document.getElementById(zoomID).value;
  if (doctor) {
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
  }
}
function updateZoomAll() {
  updateZoom("101");
  updateZoom("102");
  updateZoom("103");
  updateZoom("104");
  setTimeout(
    (() => {
      alert("Thêm thông tin bác sĩ thành công!");
      // location.reload();
    },
    1000)
  );
}

function rating(value) {
  openFlex("conten_message");
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

  if (doctorName) {
    localStorage.setItem("zoomName", zoomName);
    localStorage.setItem("doctorName", doctorName);
    closeWindow("ratingForm");
  } else {
    alert("Vui lòng nhập tên bác sĩ!");
  }
}

function openRatingForm() {
  checkZoom();
}
