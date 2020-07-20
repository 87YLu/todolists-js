// live2d
// L2Dwidget.init({
//   "display": {
//     "superSample": 2,
//     "width": 150,
//     "height": 300,
//     "position": "right",
//     "hOffset": 0,
//     "vOffset": 0
//   }
// });

// 左边栏移动
let startX, startWidth;

const getScalableDivWidth = () => {
  return startWidth = parseInt(window.getComputedStyle(document.querySelector(".scalable")).width, 10);
};

startWidth = localStorage.getItem("scalableWidth") || getScalableDivWidth();

let scalable = document.querySelector(".scalable");
let separator = document.querySelector(".separator");
let body = document.documentElement;

scalable.style.width = startWidth + "px";


const onDrag = (e) => {
  separator.style.cursor = "col-resize";
  scalable.style.width = startWidth + e.clientX - startX + "px";
};

const stopDrag = () => {
  separator.style.cursor = "";
  localStorage.setItem("scalableWidth", getScalableDivWidth())
  body.removeEventListener("mousemove", onDrag);
  body.removeEventListener("mouseup", stopDrag);
};

const startDrag = (e) => {
  startX = e.clientX;
  startWidth = getScalableDivWidth();
  body.addEventListener("mousemove", onDrag);
  body.addEventListener("mouseup", stopDrag);
};

separator.addEventListener("mousedown", startDrag);


// 登录入口
let userBtn = document.querySelector(".user-btn");
let userControl = document.querySelector(".user-control");
userBtn.innerHTML = localStorage.getItem("now-user") || "未登录";
userBtn.onclick = () => {
  userControl.style.display = "block";
};

// 用户管理
document.querySelector(".control-close").onclick = () => {
  userControl.style.display = "none";
};
document.querySelector(".zhanghu").innerHTML = localStorage.getItem("sign-users") || "";

// 清除账号密码框内容
let zhanghao = document.querySelector('.zhanghao');
let mima = document.querySelector('.mima');
const clearData = () => {
  zhanghao.value = '';
  mima.value = '';
};

// 登陆注册框
document.querySelector(".add-user").onclick = () => {
  document.querySelector(".logon-sign").style.display = "flex";
  userControl.style.display = "none";
  clearData();
};

document.querySelector(".logon-sign .close").onclick = () => {
  document.querySelector(".logon-sign").style.display = "none";
};

//注册登录
let logoneBtn = document.querySelector(".logon");
let signInBtn = document.querySelector(".sign-in");
let mes = document.querySelector(".mes");

logoneBtn.onclick = () => {
  if (logoneBtn.innerHTML == '注册') {
    logoneBtn.innerHTML = '返回登录';
    document.querySelector(".logon-sign .title").innerHTML = '注册账号';
    signInBtn.innerHTML = '注册';
    clearData();
  } else {
    logoneBtn.innerHTML = '注册'
    document.querySelector(".logon-sign .title").innerHTML = '账号登录'
    signInBtn.innerHTML = '登录';
    clearData();
  }
};
// 设置错误提示
const setMes = (value) => {
  mes.style.display = "flex";
  mes.innerHTML = value;
  setTimeout(() => {
    mes.style.display = "none";
  }, 1000);
};
// 设置geiItem字符串
const setLocalArr = () => {
  if (localStorage.getItem("users") != null) {
    let flag = (localStorage.getItem("users").indexOf("username") ==
      localStorage.getItem("users").lastIndexOf("username"))
    return flag ? [JSON.parse(localStorage.getItem("users"))] : [...JSON.parse(localStorage.getItem("users"))];
  }
}
// 提取出已有的用户名数组
const setNameArr = () => {
  let nameArr = [];
  let arr = setLocalArr();
  for (let i = 0, length = arr.length; i < length; i++) {
    nameArr.push(arr[i].username);
  }
  return nameArr;
}
// 更换清单内容函数
let lists = document.querySelector(".lists");
const changeList = () => {
  lists.innerHTML = localStorage.getItem(`${localStorage.getItem("now-user")}-lists`) || "";
}
// 注销功能和用户切换功能
document.querySelector(".zhanghu").onclick = (e) => {
  // 注销功能
  if (e.target.nodeName.toLowerCase() == "span") {
    let arr = localStorage.getItem("sign-users").replace(`<li>${e.target.parentNode.innerHTML}</li>`, "");
    localStorage.setItem("sign-users", arr);
    document.querySelector(".zhanghu").innerHTML = arr;
    if (e.target.parentNode.innerHTML.replace("<span>注销</span>", "") == localStorage.getItem("now-user")) {
      userBtn.innerHTML = "未登录";
      localStorage.removeItem("now-user");
    }
  }
  // 用户切换功能
  if (e.target.nodeName.toLowerCase() == "li") {
    let nowUser = e.target.innerHTML.replace("<span>注销</span>", "");
    userBtn.innerHTML = nowUser;
    localStorage.setItem("now-user", nowUser);
    userControl.style.display = "none";
    changeList();
    if (localStorage.getItem(`${nowUser}-lists`) != null) {
      let arr = localStorage.getItem(`${nowUser}-lists`).split(`<li class="current"><i>|</i><span>`)[1].split(`</span>`)[0];
      localStorage.setItem("now-list", `${nowUser}-${arr}`);
    }
    if (localStorage.getItem("now-list") != null) {
      document.querySelector(".nowlist-title").innerHTML = localStorage.getItem("now-list").replace(`${nowUser}-`, "");
    }
  }
}

// 按钮函数
signInBtn.onclick = () => {
  // 验证用户名
  let reg = /^[a-zA-Z0-9_]{3,16}$/;
  zhanghao.onblur = () => {
    return reg.test(zhanghao.value) ? true : false;
  };
  // 信息不全时
  if (zhanghao.value == "" || mima.value == "") {
    setMes("请输入账号或密码");
  }
  // 用户名不正确时
  else if (!zhanghao.onblur()) {
    setMes("账号由3到16位数的英文字母，数字或下划线组成");
  }
  // 符合规范时
  else {
    // 登录系统
    if (signInBtn.innerHTML == '登录') {
      if (localStorage.getItem("users") == null) {
        setMes("账号不存在！");
      } else {
        let nameArr = setNameArr();
        let index = nameArr.indexOf(zhanghao.value);
        if (index == -1) {
          setMes("账号不存在！");
        } else {
          let arr = setLocalArr();
          // 登录成功时
          if (parseInt(mima.value, 10) == parseInt(arr[index].password, 10)) {
            userBtn.innerHTML = zhanghao.value;
            localStorage.setItem("now-user", zhanghao.value);
            document.querySelector(".logon-sign").style.display = "none";
            let li = document.createElement("li");
            li.innerHTML = `${zhanghao.value}<span>注销</span>`;
            document.querySelector(".zhanghu").appendChild(li);
            localStorage.setItem("sign-users", document.querySelector(".zhanghu").innerHTML);
            changeList();
          } // 登录失败时
          else {
            setMes("密码错误！");
          }
        }
      }
    }
    // 注册账号
    else {
      // 系统没有账号时
      if (localStorage.getItem("users") == null) {
        localStorage.setItem("users", JSON.stringify({
          username: zhanghao.value,
          password: mima.value
        }));
        setMes("注册成功！正在返回登录界面…");
        setTimeout(() => {
          logoneBtn.onclick();
        }, 1200);
      } else {
        let arr = setLocalArr();
        let nameArr = setNameArr();
        // 用户已经存在时
        if (nameArr.includes(zhanghao.value)) {
          setMes("账号已存在！");
        }
        // 可以正常注册账号
        else {
          arr.push({
            username: `${zhanghao.value}`,
            password: `${mima.value}`
          });
          localStorage.setItem("users", JSON.stringify(arr));
          setMes("注册成功！正在返回登录界面…");
          setTimeout(() => {
            logoneBtn.onclick();
          }, 1200);
        }
      }
    }
  }
};

// 清单切换
if (localStorage.getItem("now-list") != null) {
  document.querySelector(".nowlist-title").innerHTML = localStorage.getItem("now-list").replace(`${localStorage.getItem("now-user")}-`, "");
} else {
  document.querySelector(".nowlist-title").innerHTML = "";
}
lists.innerHTML = localStorage.getItem(`${localStorage.getItem("now-user")}-lists`) || "";
document.oncontextmenu = function (e) {
  e.preventDefault();
};
lists.addEventListener("mousedown", (e) => {
  if (e.target.nodeName.toLowerCase() != "ul") {
    if (e.target.nodeName.toLowerCase() != "input") {
      // 左键
      if (e.button == 0) {
        let len = lists.children.length;
        for (let i = 0; i < len; i++) {
          lists.children[i].className = "";
        }
        if (e.target.nodeName.toLowerCase() == "li") {
          e.target.className = "current";
          e.target.children[2].style.display = "none";
          document.querySelector(".nowlist-title").innerHTML = e.target.innerHTML.replace(`<i>|</i><span>`, "").replace(`</span><em>删除</em>`, "");
        } else if (e.target.nodeName.toLowerCase() == "em") {
          let temp = e.target.parentNode.parentNode;
          temp.removeChild(e.target.parentNode);
          if (temp.children.length > 0) {
            temp.children[0].className = "current";
            console.log(temp.children[0]);
            document.querySelector(".nowlist-title").innerHTML = temp.children[0].innerHTML.replace(`<i>|</i><span>`, "").replace(`</span><em>删除</em>`, "");
          } else {
            document.querySelector(".nowlist-title").innerHTML = "";
          }
        } else {
          e.target.parentNode.className = "current";
          e.target.parentNode.children[2].style.display = "none";
          document.querySelector(".nowlist-title").innerHTML = e.target.parentNode.innerHTML.replace(`<i>|</i><span>`, "").replace(`</span><em>删除</em>`, "");
        }
        // 设置目前的清单以及所在的账号
        localStorage.setItem(`${localStorage.getItem("now-user")}-lists`, lists.innerHTML);
        localStorage.setItem("now-list", `${userBtn.innerHTML}-${document.querySelector(".nowlist-title").innerHTML.replace(`<em style="display: none;">删除</em>`, "")}`)

      }
      // 右键
      if (e.button == 2) {
        if (e.target.nodeName.toLowerCase() == "li") {
          e.target.children[2].style.display = "block";
        } else {
          e.target.parentNode.children[2].style.display = "block";
        }
      }
    }
  }
})

// 创建清单部分
document.querySelector(".create-list").onclick = () => {
  if (localStorage.getItem("now-user") != null) {
    let li = document.createElement("li");
    li.innerHTML = `<input type="text">`;
    lists.appendChild(li);
    let temp = lists.children[lists.children.length - 1].children[0];
    temp.focus();
    if (temp.focus()) {
      window.event.stopPropagation();
    }
    temp.onblur = () => {
      if (temp.value == "") {
        alert("请输入清单名称");
        lists.removeChild(lists.children[lists.children.length - 1]);
      } else {
        lists.children[lists.children.length - 1].innerHTML = `<i>|</i><span>${temp.value}</span><em>删除</em>`;
        localStorage.setItem(`${localStorage.getItem("now-user")}-lists`, lists.innerHTML)
        if (lists.children.length == 1) {
          lists.children[0].className = "current";
        }
      }
    }
  } else {
    alert("请先登录");
    document.querySelector(".add-user").click();
  }
}





// 设置清单内容部分
let nowListCon = document.querySelector(".nowlist-con");
nowListCon.onclick = (e) => {
  if (e.target.children[0].checked == true) {
    e.target.innerHTML = `<input type="checkbox">${e.target.innerHTML.replace(`<input type="checkbox"><del>`, "").replace(`</del>`, "")}`;
    e.target.children[0].checked = false;
  } else {
    e.target.innerHTML = `<input type="checkbox"><del>${e.target.innerHTML.replace(`<input type="checkbox">`, "")}</del>`;
    e.target.children[0].checked = true;
  }
}