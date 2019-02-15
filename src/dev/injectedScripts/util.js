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

    // 私有变量转换成公有变量
    ccIns.pri2Pub = function (key) {
        return key[0] == "_" ? key.substr(1) : key;
    };

    // 判断变量是否为object和public
    ccIns.isPublicVar = function (obj, key) {
        return !ccIns.isDeprecatedVar(obj, key) && key[0] != "_" && typeof obj[key] != "undefined" && typeof obj[key] != "function";
    };

    // 判断是不是cc类型
    ccIns.isCCType = function (obj) {
        return obj.__classname__ && obj.__classname__.substr(0, 3) == "cc.";
    };

    // 是否是废弃的变量
    ccIns.isDeprecatedVar = function(obj, key){
        // TODO: 大致是2.1.0开始加入的Node的derecated变量还是2.0？
        if(cc.ENGINE_VERSION.substr(0, 2) == "2."){
            return ['rotationX','rotationY','rotation'].hasValue(key);
        }else{
            return false;
        }
    }
}