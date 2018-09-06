// Author: huzi(moustache)
// Date: 18-8-3 9:42
// Description: util函数类，包含常用函数
export default function () {
    if (typeof ccIns == "undefined") {
        ccIns = {};
    }

    // firstUpperCase 将字符串首字母大写
    String.prototype.firstUpperCase = function () {
        return this.toString()[0].toUpperCase() + this.toString().slice(1);
    };

    // 修改数组的长度
    Array.prototype.resize = function (newSize, defaultValueFunc) {
        while (newSize > this.length) {
            this.push(defaultValueFunc());
        }
        this.length = newSize;
    };

    // 查找数组中的某个值
    Array.prototype.hasValue = function (value) {
        return this.indexOf(value) != -1;
    };
}