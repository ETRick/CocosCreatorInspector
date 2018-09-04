// Author: huzi(moustache)
// Date: 18-9-3 17:54
// Description: 此文件中的函数一对一对应原网页端，供Vue插件使用。
import Vue from 'vue';

export default function () {
    // 暂停游戏
    Vue.prototype.pauseGame = function (uuid) {
        this._evalCode("ccIns.pauseGame()");
        this.getNodeInfo(uuid);
    };

    // 恢复游戏
    Vue.prototype.resumeGame = function (uuid) {
        this._evalCode("ccIns.resumeGame()");
        this.getNodeInfo(uuid);
    };

    // 设置节点属性值
    Vue.prototype.setNodeValue = function (uuid, key, value) {
        this._evalCode('ccIns.setNodeValue("' +
            uuid + '",' +
            JSON.stringify(key) + ',' +
            JSON.stringify(value) + ')');
        this.getNodeInfo(uuid);
    };

    // 设置数组长度
    Vue.prototype.setNodeArrayLength = function (uuid, key, length) {
        this._evalCode("ccIns.setNodeArrayLength(" +
            "'" + uuid + "'," +
            "'" + key + "'," +
            length + ")");
        this.getNodeInfo(uuid);
    };

    // 设置颜色
    Vue.prototype.setNodeColor = function (uuid, value) {
        this._evalCode("ccIns.setNodeColor('" +
            uuid + "','" +
            value + "');");
        this.getNodeInfo(uuid);
    };

    // DEBUG模式下，点击节点
    Vue.prototype.clickQuadNode = function (uuid) {
        this._evalCode("ccIns.clickQuadNode(" +
            "'" + uuid + "')");
        this.getNodeInfo(uuid);
    };

    // 改变节点树
    Vue.prototype.changeNodeTree = function (fromuuid, touuid, type) {
        this._evalCode("ccIns.changeNodeTree(" +
            "'" + fromuuid + "'," +
            "'" + touuid + "'," +
            "'" + type + "')");
        this.getNodeInfo(fromuuid);
    };

    // 启动DEBUG模式
    Vue.prototype.showGraphics = function () {
        this._evalCode("ccIns.showGraphics()");
    };

    // 关闭DEBUG模式
    Vue.prototype.hiddenGraphics = function () {
        this._evalCode("ccIns.hiddenGraphics()");
    };

    // 获得节点信息
    Vue.prototype.getNodeInfo = function (uuid) {
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