
// 向原页面注入jquery
// (function injectJquery(jsPath)
// {
// 	jsPath = jsPath || 'static/js/jquery-3.3.1.js';
// 	let temp = document.createElement('script');
// 	temp.setAttribute('type', 'text/javascript');
// 	// 由于事先已经给了权限，可以访问
// 	temp.src = chrome.extension.getURL(jsPath);
// 	temp.onload = function()
// 	{
// 		// 放在页面不好看，执行完后移除掉
// 		this.parentNode.removeChild(this);
// 	};
// 	document.body.appendChild(temp);
// })();

window.addEventListener('message', function (event) {
  let data = event.data;
  // console.log("[contentScripts] " + JSON.stringify(data));
  chrome.extension.sendMessage(data);
}, false);


let gameCanvas = document.querySelector("#GameCanvas");
if (gameCanvas) {
  // console.log('find GameCanvas element');
  // gameCanvas.addEventListener('click', function () {
  //   console.log("click canvas");
  // });
  // gameCanvas.style.display = 'none';
} else {
  // console.log("can't find GameCanvas element");
  chrome.extension.sendMessage({type: 0, msg: "no creator game!"});
}



