// Author: huzi(moustache)
// Date: 18-8-29 14:52
// Description: 此文件用于注入原页面，建立和injected-scripts的连接。
window.addEventListener('message', function () {
  // 页面刷新后，提示devtools刷新
  let refleshDocument = 5;
  chrome.extension.sendMessage({
    type: refleshDocument
  });

  return function (event) {
    chrome.extension.sendMessage(event.data);
  };
}(), false);

let gameCanvas = document.querySelector("#GameCanvas");
if (gameCanvas) {} else {
  chrome.extension.sendMessage({
    type: 0,
    msg: "no creator game!"
  });
}