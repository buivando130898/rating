var menu_data = [
    // {
    //     name: 'Đánh giá bác sĩ',
    //     link: '../dashboard',
    //     id: 'dashboard',
    // },
    {
        name: 'Đánh giá chung',
        link: '../dashboard/general.html',
        id: 'general',
    },
    {
        name: 'QL Bác sĩ',
        link: '../dashboard/doctor.html',
        id: 'doctor',
    },
    {
        name: 'Mẫu đánh giá chung',
        link: '../general',
        id: 'sample',
    },
    {
        name: 'QL Dữ liệu',
        link: '../dashboard/data.html',
        id: 'data',
    },
];
console.log(menu_data);

function setMenu(menu) {
    document.getElementById(menu).style.backgroundColor = '#f5f5f5';
}
function sidebarBegin() {
    document.getElementById('sidebar').innerHTML = `
    <div id="logo">
        <img src="../static/img/logo.png" alt="" class="logo_img" id="logo_img" />
      </div>
      <div id="user">
        <div id="div_user_logo">
          <img
            alt=""
            id="user_logo"
            src="../static/img/user_logo.jpeg"
            alt=""
          />
        </div>
        <div id="div_user_name">
          <div id="user_name">Phòng khám Nura</div>
          <div id="user_stocker">admin</div>
        </div>
        <div id="div_user_logout" onclick="logout()">
          <img src="../static/img/loguot.svg" alt="" id="user_logout" />
        </div>
      </div>
      <div id="menu_div">
        <ul id="menu"></ul>
      </div>
    `;
}

function menu() {
    let menu_value = '';
    for (value of menu_data) {
        menu_value += `
      <li class="menu_item" id = "${value.id}">
        <a class="menu_item_link" href = '${value.link}'>${value.name}</a>
      </li>
      `;
    }
    document.getElementById('menu').innerHTML = menu_value;
}

header_begin();
function header_begin() {
    document.getElementById('header').innerHTML = `
        <img src="../static/img/logo_mobile.svg" alt="" class="logo_img" id="logo_img_mobile" />
        <img src="../static/img/menu_icon.svg" alt="" class="logo_menu" id="logo_menu" onclick="menu_display()" />
    
    `;
}

function menu_display() {
    if (document.getElementById('sidebar').style.display == 'block') {
        document.getElementById('sidebar').style.display = 'none';
        document.getElementById('logo_menu').src =
            '../static/img/menu_icon.svg';
    } else {
        document.getElementById('sidebar').style.display = 'block';
        document.getElementById('logo_menu').src =
            '../static/img/close_menu.svg';
    }
}

sidebarBegin();
menu();
