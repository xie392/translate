

var btn = document.getElementById('btn');
var text = document.getElementById('input');
var result = document.getElementById('result');
var all = document.getElementById('all');

const translate = (text) => {
  request(text, (res) => {
    let arr = res?.translateResult[0] || [];
    let str = '';
    arr.map(v => {
      str += v.tgt;
    })
    result.textContent = str;
  });
}

const request = (str, callback) => {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `https://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=${str}`);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  }
}

btn.addEventListener("click", () => {
  try {
    translate(text.value);
  }
  catch (err) {
    result.textContent = '翻译失败' + err;
  }
})


// 翻译整页
all.addEventListener("click", () => {
  try {
    //  发送消息给 content_script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'searchAllGoogle' }, function (response) {
        console.log("接收到消息", response);
        if (response) {
          result.textContent = response.text;
        }
      });
    });
  }
  catch (err) {
    console.log("翻译整页失败", err);
  }
})


window.onload = () => {
  try {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      console.log("接收到消息", request);
      if (request.type === 'searchWithGoogle') {
        console.log("收到消息", request.text);
        text.value = request.text;
        translate(text.value);
      }
    });
  }
  catch (err) {
    console.log("接收消息失败", err);
  }
}


