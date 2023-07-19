var input = document.getElementById('inputOriginal');
var btn = document.getElementById('transMachine');

// 解码并获取 url 参数
const getUrlParam = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]); return null;
}

if (getUrlParam('i')) {
  input.value = getUrlParam('i');
  btn.click();
} else {
  input.focus();
}
