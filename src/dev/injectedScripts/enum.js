// Author: huzi(moustache)
// Date: 18-9-6 9:56
// Description: enum枚举属性，用来储存和发送枚举值
export default function () {
    if (typeof ccIns == "undefined") {
        ccIns = {};
    }

    /* --------- Enum 部分 ---------- */
    ccIns.Enum = ccIns.Enum || {};

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
}