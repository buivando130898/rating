function closeWindow(id) {
    document.getElementById(id).style.display = "none";
    if(document.getElementById('title_form')) {
      document.getElementById('title_form').innerHTML = "";
    }

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
  
  function noti(type, message) {
    // Tạo thẻ div cho thông báo
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;
  
    // Thêm thẻ div vào body
    document.body.appendChild(notification);
  
    // Hiển thị thông báo
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
  
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
  }
  
  function setMenu(menu) {
    document.getElementById(menu).style.backgroundColor = '#f5f5f5'
  }
  
  function getToday() {
    const currentDate = new Date();
  
    const day = String(currentDate.getDate()).padStart(2, '0'); // Đảm bảo ngày có 2 chữ số
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Đảm bảo tháng có 2 chữ số
    const year = currentDate.getFullYear();
  
    // Định dạng năm/tháng/ngày và trả về chuỗi kết quả
    return `${year}-${month}-${day}`;
  }
  
  
  function gen_code() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
  
    // const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase(); // Tạo một chuỗi ngẫu nhiên
  
    const transactionCode = `${year}${month}${day}${hours}${minutes}}`;
    return transactionCode;
  }

  function check_value(value) {
    if(value) {
      return value;
    }
    return "";
  }