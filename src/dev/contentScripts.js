window.addEventListener('message', function () {
  // 页面刷新后，提示devtools刷新
  chrome.extension.sendMessage({type: 5});
  return function (event) {
    let data = event.data;
    chrome.extension.sendMessage(data);
  };
}(), false);


let gameCanvas = document.querySelector("#GameCanvas");
if (gameCanvas) {} else {
  chrome.extension.sendMessage({
    type: 0,
    msg: "no creator game!"
  });
}