// server = "http://localhost/rating/api/auth.php/login";
server = "https://ratingnura.nura.com.vn//api/auth.php/login";

function login() {
  user = document.getElementById("user").value;
  pass = document.getElementById("pass").value;
  data = {
    user,
    pass,
  };
  axios
    .post(server, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      data = response.data;
      if (data) {
        console.log(data);
        localStorage.setItem("user", data[0].user);
        localStorage.setItem("token", data[0].token);
        localStorage.setItem("manager", data[0].manager);
        if (data[0].manager != "admin") {
          window.location = "../";
        } else {
          window.location = "../dashboard/";
        }
      } else {
        document.getElementById("info_erro").innerHTML =
          "Tài khoản hoặc mật khẩu không chính xác";
      }
    })
    .catch(function (error) {
      document.getElementById("info_erro").innerHTML =
        "Tài khoản hoặc mật khẩu không chính xác";
    });
}

document.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    login();
  }
});
