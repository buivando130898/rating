// server = "http://localhost/rating";
server = "http://ratingnura.nura.com.vn";

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("manager");
  window.location = `${server}/login`;
}

tokenCheck();

function tokenCheck() {
  checkMenu();
  user = localStorage["user"];
  token = localStorage["token"];
  manager = localStorage["manager"];
  console.log(user);
  // document.getElementById("zoomID").innerHTML = user;
  data = {
    user,
    token,
  };
  if (user && token) {
    axios
      .post(server + "/api/auth.php/token_check", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        data = response.data;
        console.log(data);
        if (data) {
          document.getElementById("main").style.display = "block";
        } else {
          window.location = `${server}/login`;
        }
      })
      .catch(function (error) {
        console.log(error);
        // document.getElementById("info_erro").innerHTML =
        //   "Tài khoản hoặc mật khẩu không chính xác";
      });
  } else {
    window.location = `${server}/login`;
  }
}

function closeWindow(id) {
  document.getElementById(id).style.display = "none";
  resetInput();
}

function openBlock(id) {
  document.getElementById(id).style.display = "block";
}

function openFlex(id) {
  document.getElementById(id).style.display = "flex";
}

function openTable(id) {
  document.getElementById(id).style.display = "table";
}

function closeBlock(id) {
  document.getElementById(id).style.display = "none";
}

function setValue(id, value) {
  if (id) {
    document.getElementById(id).value = value;
  }
}

function clearValue(arrayID) {
  arrayID.map((value) => {
    document.getElementById(value).value = "";
  });
}

function getValue(id) {
  let value = document.getElementById(id).value;
  return value.replace(/['"]/g, "");
}

function resetInput() {
  // Lấy danh sách các phần tử input là con của class 'form_info'
  const formInputs = document.querySelectorAll(".form_info input");
  // Đặt giá trị của tất cả các input thành chuỗi rỗng
  formInputs.forEach((input) => {
    input.value = "";
  });

  // Lấy danh sách các phần tử input là con của class 'form_info'
  const formTextarea = document.querySelectorAll(".form_info textarea");
  // Đặt giá trị của tất cả các input thành chuỗi rỗng
  formTextarea.forEach((textarea) => {
    textarea.value = "";
  });
}

function display_menu() {
  if (document.getElementById("menu_all").style.display == "block") {
    document.getElementById("menu_all").style.display = "none";
  } else {
    document.getElementById("menu_all").style.display = "block";
  }
}

function checkMenu() {
  let manager = localStorage["manager"];
  menu = document.getElementsByClassName(manager);
  for (li of menu) {
    li.style.display = "block";
  }
}
