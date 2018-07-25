export default function () {
  // String 字符串扩展函数
  // firstUpperCase 将字符串首字母大写
  String.prototype.firstUpperCase = function () {
    let that = this;
    return that.toString()[0].toUpperCase() + that.toString().slice(1);
  };
  // eraseSubstring 将字符串删去子串部分
  String.prototype.eraseSubstring = function (str) {
    let that = this;
    return that.replace(str, "");
  };

  // Array 数组扩展函数
  // sliceByObj 通过给定的obj切分数组，只取前半部分
  Array.prototype.sliceByObj = function (obj) {
    let that = this;
    let index = that.indexOf(obj);
    if (index == -1) {
      return that;
    } else {
      return that.slice(0, index);
    }
  };

  // 得到主键
  window.getPublicKeys = function (obj) {
    return Object.keys(obj).filter(function (key) {
      return key[0] != "_";
    });
  };
}
