
try {
  // 接收 popup 发来的消息
  chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.type === 'searchAllGoogle') {
      console.log("翻译整页", document.body.innerHTML);
      // 发送消息给 background.js
      // chrome.runtime.sendMessage({ type: 'searchHTMLGoogle', text: document.body.innerHTML });
      let str = filterTag(document.body.innerHTML);
      requestData(str, (res) => {
        console.log("res====>", res.data?.translation);
      });
    }
  });

  // 当鼠标选中文本时, 发送消息给 popup
  // document.addEventListener("mouseup", () => addNode());

  // 鼠标取消选中时，移除btn
  // document.addEventListener("mousedown", () => {
  //   let btn = document.querySelector('#translate-btn');
  //   if (btn) {
  //     setTimeout(() => btn.remove(), 1000);
  //   }
  // });

  console.log(`%c翻译小组手正在为你服务！`, "color:blue;");
}
catch (err) {
  console.log(`%c翻译小组手提醒您：%c${err}`, "color:blue;", "color:red;");
}

/**
 * 添加节点
 */
const addNode = () => {
  let selection = window.getSelection();
  let text = selection.toString();
  var top = selection.getRangeAt(0).getBoundingClientRect().top;
  var left = selection.getRangeAt(0).getBoundingClientRect().left;
  if (text) {
    let btn = document.createElement('button');
    btn.id = "translate-btn";
    btn.textContent = '翻译';
    btn.style.position = 'absolute';
    btn.style.top = top - 40 + 'px';
    btn.style.left = left + 'px';
    btn.style.zIndex = 9999;
    btn.style.background = 'red';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.padding = '5px';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);

    setTimeout(() => btn.remove(), 5000);

    btn.addEventListener('click', async () => {
      btn.remove();
      selection.removeAllRanges();
      await requestData(text, (res) => {
        console.log("res====>", res.data?.translation);
        let div = document.createElement('div');
        div.id = "translate-div";
        div.textContent = res.data?.translation;
        div.style.position = 'absolute';
        div.style.top = top + 30 + 'px';
        div.style.left = left + 'px';
        div.style.zIndex = 9999;
        div.style.background = '#fff';
        div.style.color = '#000';
        div.style.border = '1px solid #ccc';
        div.style.borderRadius = '5px';
        div.style.font = '14px/2 微软雅黑 ';
        div.style.padding = '10px';
        div.style.width = '300px';
        div.style.height = '200px';
        div.style.overflow = 'auto';
        div.style.cursor = 'pointer';
        document.body.appendChild(div);
      });
      console.log("text====>", text);
    })
  }
}


const requestData = async (str, callback) => {
  // 提交表单
  await fetch("https://aidemo.youdao.com//trans_html", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    // 表单数据
    body: `q=${str}&from=en&to=zh-CHS`
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      callback({ code: 500, error: error });
    });
}

/**
 * 过滤所有 html 标签,只保留文本, 并替换成对应的标签
 * @param {*} str
 * @returns
 */
const filterTag = (str) => {
  // 匹配白名单
  const whiteList = [
    { id: Math.round(Math.random() * 10000) + new Date().getTime(), name: "script", con: [] },
    { id: Math.round(Math.random() * 10000) + new Date().getTime(), name: "style", con: [] },
    { id: Math.round(Math.random() * 10000) + new Date().getTime(), name: "pre", con: [] },
    { id: Math.round(Math.random() * 10000) + new Date().getTime(), name: "code", con: [] }
  ];

  let newStr = "";

  whiteList.map(v => {
    const reg = new RegExp("(<" + v.name + ">[\\s\\S]+?<\/" + v.name + ">)", "g");
    const html = newStr ? newStr : str;
    const match = html.match(reg);
    if (match) {
      match.map(v1 => v.con.push(v1));
    }
    newStr = html.replace(reg, `<span data-id="my-${v.id}"></span>`);
  })

  // 编写正则 匹配HTML标签之间的内容,白名单中的不匹配
  const html_reg = /[^><]+(?=<\/)/g;


  let new_html = "";


  // 替换内容
  const arr = newStr.match(html_reg);

  // const 

  // const html_con = newStr.replace(html_reg, "<span data-id='my-$&'></span>");


  // 替换回白名单内容
  whiteList.map((v, i) => {
    const reg = new RegExp(`<span data-id="my-${v.id}"></span>`, "g");
    const html = new_html ? new_html : html_con;
    if (v.con.length) {
      v.con.map((v1, i1) => {
        new_html = html.replace(reg, v1);
      })
    } else {
      new_html = html.replace(reg, "");
    }
  })

  console.log("html_con", new_html);
}
