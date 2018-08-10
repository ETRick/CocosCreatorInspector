<template>
  <div id="app">
    <el-button type="success" class="el-icon-refresh reflesh-button" size="small" @click="onBtnClickUpdatePage">刷新</el-button>
    <div style="float: right">
      <el-button v-if="hasGraphics" type="danger" class="el-icon-view debug-button" size="small" :disabled="!isShowDebug" @click="onBtnClickDebug">
        {{(isEnterDebugMode ? "退出" : "进入") + "Debug模式"}}
      </el-button>
    </div>

    <div v-show="isShowDebug">
      <el-row>
        <el-col :span="10">
          <NodeTreeProperty :treeData="treeData"
                            nodeKey="uuid"
                            ref="tree">
          </NodeTreeProperty>
        </el-col>
        <el-col :span="14">
          <div class="grid-content bg-purple-light treeInfo">
            <NodeBaseProperty :itemData="treeItemData"></NodeBaseProperty>
            <ComponentsProperty :components="treeItemData.components"></ComponentsProperty>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-show="!isShowDebug">
      未发现cocos creator的游戏!
    </div>
  </div>
</template>

<script>
import injectPlugin from "../injectedScripts/plugin.js";
import injectConnect from "../injectedScripts/connect.js";
import injectMain from "../injectedScripts/main.js";
import injectDebugDOM from "../injectedScripts/debugGraphics.js";
import injectUtil from "../injectedScripts/util.js"

import injectConfig from "../../config/debugmode";

export default {
  name: "app",
  data() {
    return {
      isShowDebug: false,
      isEnterDebugMode: false,
      hasGraphics: true,
      treeItemData: {},
      treeData: [],
      oldTreeData: [],
      filterText: "",
    };
  },
  created() {
    if (chrome && chrome.extension) {
    } else {
      this.isShowDebug = true;
      this.onTestData();
      return;
    }
    let backgroundPageConnection = chrome.extension.connect({
      name: btoa("for" + String(chrome.devtools.inspectedWindow.tabId))
    });

    backgroundPageConnection.onMessage.addListener(
        function(message) {
          // console.log("getInfo:", message);
          if (message !== null) {
            // 定义通讯变量
            const msgType = {
              notSupport: 0, // 不支持的游戏
              nodeListInfo: 1, // 节点列表信息
              nodeInfo: 2, // 节点信息
              refleshInfo: 3, // 节点刷新信息
              clickedNodeInfo: 4, // 出现节点被点击
              refleshDocument: 5, // 出现页面刷新
            };
            switch (message.type) {
              case msgType.nodeListInfo: {
                // 游戏树节点
                this.isShowDebug = true;
                this._updateView(message.msg);
                break;
              } 
              case msgType.notSupport: {
                // 不支持调试
                if (message.msg == "不支持调试游戏!") {
                  this.isShowDebug = false;
                } else if (message.msg == "不支持Debug模式!") {
                  this.hasGraphics = false;
                }
                break;
              }
              case msgType.nodeInfo: {
                // 获取节点属性信息
                this.isShowDebug = true;
                this.treeItemData = message.msg;
                break;
              }
              case msgType.refleshInfo: {
                // 刷新节点
                this._freshNode(this.treeItemData.uuid);
                break;
              }
              case msgType.clickedNodeInfo: {
                // 直接点击树节点
                let treeproto = this.$refs.tree.$refs.tree;
                let uuid = message.msg;
                // 节点属性页面更新
                this.$refs.tree.handleNodeClick({uuid: uuid});
                // 节点树更新
                let node = treeproto.getNode(uuid);
                // 节点展开
                while (node.parent) {
                  node.parent.expanded = true;
                  node = node.parent;
                }
                treeproto.setCurrentKey(uuid);
                break;
              }
              case msgType.refleshDocument: {
                if (this.isShowDebug) {
                  this.onBtnClickUpdatePage();
                }
                break;
              }
              default: {
                console.log(message);
              }  
            }
          }
      }.bind(this)
    );
  },
  methods: {
    // 更新树
    _updateTree(oldtree, newtree) {
      let oldchildren = oldtree.children;
      let newchildren = newtree.children;
      for (let i = 0; i < newchildren.length; i++) {
        if (typeof oldchildren[i] == 'undefined') {
          // add
          oldchildren.push(newchildren[i]);
        } else if (oldchildren[i].uuid != newchildren[i].uuid) {
          // replace
          oldchildren.splice(i, 1, newchildren[i]);
        } else {
          // update name
          if (oldchildren[i].name != newchildren[i].name) {
            oldchildren[i].name = newchildren[i].name;
          }
          // update active
          if (oldchildren[i].activeInHierarchy !== newchildren[i].activeInHierarchy) {
            oldchildren[i].activeInHierarchy = newchildren[i].activeInHierarchy;
          }
          this._updateTree(oldchildren[i], newchildren[i]);
        }
      }
      // remove
      if (oldchildren.length > newchildren.length) {
        oldchildren.splice(newchildren.length, oldchildren.length - newchildren.length);
      }
    },
    // 渲染界面
    _updateView(data) {
      // 第一次赋值，渲染右边界面
      if (JSON.stringify(this.treeData) === "[]") {
        // 获得数据
        this.treeData = data;
        this._freshNode(this.treeData[0].uuid);
      } else {
        let newTree = data;
        this._updateTree(this.treeData[0], newTree[0]);
      }
    },
    _getInjectScriptString(script) {
      // PS:脚本代码行数过多会读不进来，目前测试为230行
      let code = script.toString();
      // console.log(code);
      let array = code.split("\n");
      let evalCode = "(";
      for (let i = 0; i < array.length; i++) {
        evalCode += array[i] + "\n";
      }
      evalCode += ")()";
      // console.log(evalCode);
      return evalCode;
    },
    _getConfigObjString() {
      let code = getJsonObj("ccIns.Config", {});
      code += getJsonObj("ccIns.Config.DEBUG_MODE", injectConfig);
      return code;

      function getJsonObj(identify, obj) {
        return identify + " = " + "JSON.parse('" + JSON.stringify(obj) + "');";
      }
    },
    onBtnClickUpdatePage() {
      // 注入脚本
      let code = this._getInjectScriptString(injectUtil);
      chrome.devtools.inspectedWindow.eval(code);
      code = this._getInjectScriptString(injectConnect);
      chrome.devtools.inspectedWindow.eval(code);
      code = this._getInjectScriptString(injectPlugin);
      chrome.devtools.inspectedWindow.eval(code);
      // 注入config
      code = this._getConfigObjString();
      chrome.devtools.inspectedWindow.eval(code);
      code = this._getInjectScriptString(injectDebugDOM);
      chrome.devtools.inspectedWindow.eval(code);
      code = this._getInjectScriptString(injectMain);
      chrome.devtools.inspectedWindow.eval(code, function() {
        console.log("刷新成功!");
      });
    },
    onBtnClickDebug() {
      this.isEnterDebugMode = !this.isEnterDebugMode;
      if (this.isEnterDebugMode) {
        this._evalCode("ccIns.showGraphics()");
      } else {
        this._evalCode("ccIns.hiddenGraphics()");
      }
    }
  }
};
</script>

<style scoped>
.treeInfo {
  height: 100%;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

body span h1 h2 h3 {
  font-family: BlinkMacSystemFont, "Helvetica Neue", Helvetica, "Lucida Grande",
    "Segoe UI", Ubuntu, Cantarell, "SourceHanSansCN-Normal", Arial, sans-serif;
}

.reflesh-button {
  margin-bottom: 10px;
}

.debug-button {
  margin-bottom: 10px;
}
</style>
