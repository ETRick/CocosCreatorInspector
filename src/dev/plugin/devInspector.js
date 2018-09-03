// Author: huzi(moustache)
// Date: 18-9-3 17:54
// Description: 此文件负责devtools的接口声明和定义，供Vue插件使用。
import Vue from 'vue';

export default function () {
    // Vue Vue扩展脚本函数
    // 刷新节点
    Vue.prototype._freshNode = function (uuid) {
        if (uuid) {
            let code2 = "ccIns.getNodeInfo('" + uuid + "')";
            this._evalCode(code2);
        }
    };

    // 执行代码
    Vue.prototype._evalCode = function (code) {
        if (chrome && chrome.devtools) {
            chrome.devtools.inspectedWindow.eval(code);
        } else {
            console.log(code);
        }
    };
}