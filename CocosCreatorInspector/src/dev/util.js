
export default function() {
  // let index = 0;
  // setInterval(function () {
  //   let msg = "util: " + index++;
  //   // chrome.extension.sendMessage(msg;
  //   if (typeof aa !== undefined) {
  //     msg = aa;
  //   }
  //   window.postMessage({type: 1, msg: msg}, '*');
  // }.bind(this), 2000);

  String.prototype.firstUpperCase = function() {
    let that = this;
    return that.toString()[0].toUpperCase() + that.toString().slice(1);
  }

  String.prototype.eraseSubstring = function(str) {
    let that = this;
    return that.replace(str, "");
  }
}


