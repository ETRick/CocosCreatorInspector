// Author: huzi(moustache)
// Date: 18-9-4 16:00
// Description: util功能函数
import Vue from 'vue';

export default function () {
  /* ---------- String 字符串扩展函数 ---------- */
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

  // 判断有没有子串，大小写不灵敏
  String.prototype.hasSubstrIgnoreCase = function (substr) {
    return this.toLowerCase().indexOf(substr.toLowerCase()) !== -1;
  };

  /* ---------- Array 数组扩展函数 ---------- */
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

  // hasValue 判断数组中有没有value值
  Array.prototype.hasValue = function (value) {
    return this.indexOf(value) != -1;
  };

  /* ---------- Vue Vue脚本扩展函数 ---------- */
  // 用于处理枚举属性
  // 枚举类型储存的地方
  Vue.enumStorage = Vue.enumStorage || {};

  // 添加枚举类型
  Vue.enumStorage.add = function (obj) {
    Vue.enumStorage[obj.key] = obj.value;
  };

  // 获得枚举类型
  Vue.enumStorage.get = function (comptype, key) {
    comptype = comptype.firstUpperCase();
    key = key.firstUpperCase();
    if (arguments.length == 1) {
      return Vue.enumStorage[comptype];
    } else if (arguments.length == 2) {
      if (Vue.enumStorage[comptype]) {
        return Vue.enumStorage[comptype][key];
      }
    }
  };
}