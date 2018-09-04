<template>
  <div>
    <!-- 刷新按钮 -->
    <el-button type="success" class="el-icon-refresh reflesh-button" size="small" @click="onBtnClickUpdatePage">刷新</el-button>
    <!-- DEBUG按钮 -->
    <el-button v-if="hasGraphics" type="danger" class="el-icon-view debug-button" size="small" :disabled="!isShowDebug" @click="onBtnClickDebug">
      {{(isEnterDebugMode ? "退出" : "进入") + "Debug模式"}}
    </el-button>

    <div v-show="isShowDebug">
      <el-row>
        <!-- 左侧显示树形结构 -->
        <el-col :span="10">
          <NodeTreeProperty :treeData="treeData" nodeKey="uuid" ref="tree" />
        </el-col>
        <!-- 右侧显示具体属性 -->
        <el-col :span="14">
          <div class="bg-purple-light treeInfo">
            <NodeBaseProperty :itemData="treeItemData" />
            <ComponentsProperty :components="treeItemData.components" />
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
import Vue from 'vue';

import injectPlugin from "../injectedScripts/plugin.js";
import injectConnect from "../injectedScripts/connect.js";
import injectMain from "../injectedScripts/main.js";
import injectDebugGraphics from "../injectedScripts/debugGraphics.js";
import injectUtil from "../injectedScripts/util.js"
import injectConfig from "../../config/injectedScripts.json";

export default {
  data() {
    return {
      isShowDebug: false,  // 是否有cc变量
      hasGraphics: true,  // 是否有cc.Graphics变量
      isEnterDebugMode: false,  // 是否进入DEBUG模式
      treeData: [],  // 节点树属性，绑定左侧组件
      treeItemData: {},  // 节点属性，绑定右侧组件
    };
  },
  created() {
    if (!chrome || !chrome.extension) {
      return;
    }

    // 建立和背景页面的连接
    let backgroundPageConnection = chrome.extension.connect({
      name: btoa("for" + String(chrome.devtools.inspectedWindow.tabId))
    });

    // 添加监听器
    backgroundPageConnection.onMessage.addListener(this._handlePostData.bind(this));
  },
  methods: {
    // 处理收到的数据
    _handlePostData(message) {
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
          enumType: 6, // 节点中的枚举信息
        };
        switch (message.type) {
          case msgType.notSupport: {
            // 不支持调试
            if (message.msg == "不支持调试游戏!") {
              this.isShowDebug = false;
            } else if (message.msg == "不支持Debug模式!") {
              this.hasGraphics = false;
            }
            break;
          }
          case msgType.nodeListInfo: {
            // 渲染游戏树节点
            this.isShowDebug = true;
            this._updateView(message.msg);
            break;
          } 
          case msgType.nodeInfo: {
            // 获取节点属性信息
            this.treeItemData = message.msg.value;
            break;
          }
          case msgType.refleshInfo: {
            // 刷新节点
            if (this.treeItemData.uuid) {
              this.getNodeInfo(this.treeItemData.uuid.value);
            }
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
              // 设置触发器，每1.5s尝试刷新新的节点
              sleep(1500);
              // 设置回调函数，回调中会重复调用函数直到成功
              let callback = function (success) {
                if (!success) {
                  sleep(1500);
                  this.onBtnClickUpdatePage(callback);
                } else {
                  // 刷新debug模式
                  if (this.isEnterDebugMode) {
                    this.showGraphics();
                  }
                }
              }.bind(this);
              this.onBtnClickUpdatePage(callback);
            }

            function sleep(numberMillis) {
              var now = new Date();
              var exitTime = now.getTime() + numberMillis;
              while (true) {
                now = new Date();
                if (now.getTime() > exitTime)
                  return;
              }
            }
            break;
          }
          case msgType.enumType: {
            // 直接添加枚举值
            Vue.enumStorage.add(message.msg);
            break;
          }
          default: {
            console.log(message);
          }  
        }
      }
    },
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
      if (JSON.stringify(this.treeData) === "[]") {
        // 第一次赋值，获取数据后，渲染右边界面
        this.treeData = data;
        this.getNodeInfo(this.treeData[0].uuid);
      } else {
        let newTree = data;
        this._updateTree(this.treeData[0], newTree[0]);
      }
    },
    // 获得注入脚本的字符串
    _getInjectScriptString(script) {
      // PS:脚本代码行数过多会读不进来，目前测试为230行
      let code = script.toString();
      let array = code.split("\n");
      let evalCode = "(";
      for (let i = 0; i < array.length; i++) {
        evalCode += array[i] + "\n";
      }
      evalCode += ")()";
      // typeof会被编译成_typeof，需要转换回来
      return evalCode.replace(/_typeof/g, "typeof");
    },
    // 获得注入脚本的配置文件
    _getConfigString() {
      let code = getJsonObj("ccIns.Config", injectConfig);
      return code;

      function getJsonObj(identify, obj) {
        return identify + " = " + JSON.stringify(obj) + ";";
      }
    },
    onBtnClickUpdatePage(e) {
      // 注入脚本
      let code = this._getInjectScriptString(injectUtil);
      chrome.devtools.inspectedWindow.eval(code);
      code = this._getInjectScriptString(injectConnect);
      chrome.devtools.inspectedWindow.eval(code);
            console.log(code);
      code = this._getInjectScriptString(injectPlugin);
      chrome.devtools.inspectedWindow.eval(code);
      // 注入config
      code = this._getConfigString();
      chrome.devtools.inspectedWindow.eval(code);
      code = this._getInjectScriptString(injectDebugGraphics);
      chrome.devtools.inspectedWindow.eval(code);
      code = this._getInjectScriptString(injectMain);
      chrome.devtools.inspectedWindow.eval(code, function(rtn) {
        console.log("刷新成功!");
        // 执行回调函数
        if (typeof e == "function") {
          let func = e;
          func(rtn);
        }
      });
    },
    onBtnClickDebug() {
      this.isEnterDebugMode = !this.isEnterDebugMode;
      if (this.isEnterDebugMode) {
        this.showGraphics();
      } else {
        this.hiddenGraphics();
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
    float: right;
  }
</style>
