chrome.runtime.onInstalled.addListener(function () {
  // 右键
  chrome.contextMenus.create({
    id: 'searchWithGoogle',
    title: '翻译选中的内容',
    contexts: ['selection']
  });

   // 
  // 鼠标右键点击事件
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
      case 'searchWithGoogle':
        chrome.tabs.create({ url: 'https://fanyi.youdao.com?i=' + info.selectionText });
        // chrome.runtime.sendMessage({ type: 'searchWithGoogle', text: info.selectionText });
        break;
    }
  });

  // 接收 popup 发来的消息
  // chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    // if (request.type === 'searchHTMLGoogle') {
      // filterTag
      // let str = filterTag(request.text);
      // console.log("过滤后", str);
      // var newHtml = "";
      // if (str.length > 5000) {
      //   // 切割字符串
      //   var arr = [];
      //   var len = str.length;
      //   var num = Math.floor(len / 5000);
      //   for (var i = 0; i < num; i++) {
      //     arr[i] = str.substring(5000 * (i + 1), 5000);
      //     await requestData(arr[i], (res) => {
      //       newHtml += res.data?.translation || "";
      //     });
      //   }
      // }
      // else {
      //   await requestData(str, (res) => {
      //     newHtml += res.data?.translation || "";
      //   });
      // }
      // // 发送消息给 content.js
      // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      //   chrome.tabs.sendMessage(tabs[0].id, { type: 'searchResult', text: newHtml });
      // });
    // }
  // });

});

// const requestData = async (str, callback) => {
//   // 提交表单
//   await fetch("https://aidemo.youdao.com//trans_html", {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     // 表单数据
//     body: `q=${str}&from=en&to=zh-CHS`
//   })
//     .then((response) => {
//       if (response.ok) return response.json();
//       throw new Error('Network response was not ok.');
//     })
//     .then((response) => {
//       callback(response);
//     })
//     .catch((error) => {
//       callback({ code: 500, error: error });
//     });
// }



// /**
//  * 过滤所有 html 标签,只保留文本, 并替换成对应的标签 
//  * @param {*} str
//  * @returns 
//  */
// const filterTag = (str) => {
//   var reg = /<[^>]*>/g;
//   return str.replace(reg, "");
// }

// /**
//  * 更具对应的 key 获取对应的 value
//  * @param {*} key
//  * @returns
//  */
// const adddrTag = (key) => {

// }









