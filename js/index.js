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
startWidth = localStorage.getItem("scalableWidth") || getScalableDivWidth();

let scalable = document.querySelector(".scalable");
let separator = document.querySelector(".separator");
let body = document.documentElement;

scalable.style.width = startWidth + "px";

const getScalableDivWidth = () => {
  return startWidth = parseInt(window.getComputedStyle(document.querySelector(".scalable")).width, 10);
};

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
userBtn.onclick = () => {
  document.querySelector(".user-control").style.display = "block";
}

// 用户管理
document.querySelector(".control-close").onclick = () => {
  document.querySelector(".user-control").style.display = "none";
}

// 登陆注册框
document.querySelector(".add-user").onclick = () => {
  document.querySelector(".logon-sign").style.display = "flex";
}

document.querySelector(".logon-sign .close").onclick = () => {
  document.querySelector(".logon-sign").style.display = "none";
}