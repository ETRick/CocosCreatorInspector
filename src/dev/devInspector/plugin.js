// Author: huzi(moustache)
// Date: 18-9-3 17:54
// Description: 此文件负责devtools的接口声明和定义，供Vue插件使用。
import Vue from 'vue';

export default function () {
    // Vue Vue扩展脚本函数
    // 暂停游戏
    Vue.prototype.pauseGame = function (uuid) {
        this._evalCode("ccIns.pauseGame()");
        this._freshNode(uuid);
    };

    // 恢复游戏
    Vue.prototype.resumeGame = function (uuid) {
        this._evalCode("ccIns.resumeGame()");
        this._freshNode(uuid);
    };

    // 设置节点属性值
    Vue.prototype.setNodeValue = function (uuid, key, value) {
        console.log('ccIns.setNodeValue("' +
            uuid + '",' +
            JSON.stringify(key) + ',' +
            JSON.stringify(value) + ')');
        this._evalCode('ccIns.setNodeValue("' +
            uuid + '",' +
            JSON.stringify(key) + ',' +
            JSON.stringify(value) + ')');
        this._freshNode(uuid);
    };

    // 设置数组长度
    Vue.prototype.setNodeArrayLength = function (uuid, key, length) {
        this._evalCode("ccIns.setNodeArrayLength(" +
            "'" + uuid + "'," +
            "'" + key + "'," +
            length + ")");
        this._freshNode(this.uuid);
    };

    // 设置颜色
    Vue.prototype.setNodeColor = function (uuid, value) {
        this._evalCode("ccIns.setNodeColor('" +
            uuid + "','" +
            value + "');");
        this._freshNode(uuid);
    };

    // DEBUG模式下，点击节点
    Vue.prototype.clickQuadNode = function (uuid) {
        this._evalCode("ccIns.clickQuadNode(" +
            "'" + uuid + "')");
        this._freshNode(uuid);
    };

    // 改变节点树
    Vue.prototype.changeNodeTree = function (fromuuid, touuid, type) {
        this._evalCode("ccIns.changeNodeTree(" +
            "'" + fromuuid + "'," +
            "'" + touuid + "'," +
            "'" + type + "')");
        this._freshNode(fromuuid);
    };

    // 刷新节点
    Vue.prototype._freshNode = function (uuid) {
        this._evalCode("ccIns.getNodeInfo('" + uuid + "')");
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