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