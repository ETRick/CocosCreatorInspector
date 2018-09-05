// Author: huzi(moustache)
// Date: 18-8-3 9:42
// Description: util函数类，包含各种挂载到其他物体上的函数（不作为接口）
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

    /* --------- Memory部分 ---------- */
    ccIns.gameMemoryStorage = ccIns.gameMemoryStorage || {};

    // 添加物体到内存中
    ccIns.addObjectToStorage = function (uuid, key, value) {
        ccIns.gameMemoryStorage[uuid] = ccIns.gameMemoryStorage[uuid] || {};
        ccIns.gameMemoryStorage[uuid][key] = value;
    };

    // 从内存中得到物体
    ccIns.getObjectFromStorage = function (uuid, key) {
        if (ccIns.gameMemoryStorage[uuid]) {
            if (typeof key == 'undefined') {
                return ccIns.gameMemoryStorage[uuid];
            } else {
                return ccIns.gameMemoryStorage[uuid][key];
            }
        }
    };

    // 从内存中删除物体
    ccIns.removeObjectFromStorage = function (uuid) {
        delete ccIns.gameMemoryStorage[uuid];
    };

    /* --------- Enum部分 ---------- */
    ccIns.Enum = ccIns.Enum || {};

    // 判断变量是否为object和public
    ccIns.isPublicVar = function (obj, key) {
        return key[0] != "_" && typeof obj[key] != "function";
    };

    // 判断是不是cc类型
    ccIns.isCCType = function (obj) {
        return obj.__classname__ && obj.__classname__.substr(0, 3) == "cc.";
    };

    // 添加一个脚本的枚举属性，不重复添加
    ccIns.Enum.add = function (com) {
        let comptype = com.__classname__.substr(3);
        if (cc[comptype] && !ccIns.Enum[comptype]) {
            ccIns.Enum[comptype] = {};

            // 特例：srcBlendFactor和dstBlendFactor
            if (cc.macro) {
                ccIns.Enum[comptype].SrcBlendFactor = cc.macro.BlendFactor;
                ccIns.Enum[comptype].DstBlendFactor = cc.macro.BlendFactor;
            }

            let staticClass = cc[comptype];
            // 通过__props__获取值
            for (let key of cc[comptype].__props__) {
                key = key.firstUpperCase();
                if (isEnumType(key)) {
                    ccIns.Enum[comptype][key] = staticClass[key];
                }
            }
            return true;

            // 通过判断有没有__enums__属性判断是否为枚举属性
            function isEnumType(key) {
                return staticClass[key] && staticClass[key].__enums__;
            }
        }
        return false;
    };

    // 得到枚举量
    ccIns.Enum.get = function (com) {
        let comptype = com.__classname__.substr(3);
        return ccIns.Enum[comptype];
    };

    /* ---------- Timer 部分 ---------- */
    // 用于main中设置触发器
    ccIns.Timer = ccIns.Timer || function (interval) {
        this.timer = 0;
        this.interval = interval || 0;
        this.isRunning = true;

        // 计时器运行
        this.run = function (deltaTime) {
            if (this.isRunning) {
                this.timer += deltaTime || cc.director._deltaTime;
            }
        };

        // 计时器判断是否到达时间
        this.isTimeOut = function () {
            if (this.timer > this.interval) {
                this.timer = 0;
                return true;
            }
            return false;
        };

        // 计时器清零
        this.clearTime = function () {
            this.timer = 0;
        };
    };
}