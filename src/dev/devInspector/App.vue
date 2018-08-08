<template>
  <div id="app">
    <el-button type="success" class="el-icon-refresh reflesh-button" size="small" @click="onBtnClickUpdatePage">刷新</el-button>
    <div style="float: right">
      <el-button type="danger" class="el-icon-view debug-button" size="small" :disabled="!isShowDebug" @click="onBtnClickDebug">
        {{(isEnterDebugMode ? "退出" : "进入") + "Debug模式"}}
      </el-button>
    </div>

    <!--<el-button type="success" size="mini" @click="onBtnClickTest">test</el-button>-->
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
import injectUtil from "..//injectedScripts/util.js"

export default {
  name: "app",
  data() {
    return {
      isShowDebug: false,
      isEnterDebugMode: false,
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
            const msgType = {
              clickedNodeInfo: 4, // 出现节点被点击
              refleshInfo: 3, // 节点刷新信息
              nodeInfo: 2, // 节点信息
              nodeListInfo: 1, // 节点列表信息
              notSupport: 0 // 不支持的游戏
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
                this.isShowDebug = false;
                break;
              }
              case msgType.nodeInfo: {
                // 获取节点属性信息
                this.isShowDebug = true;
                // console.log("node:", Object.keys(message.msg));
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
              default:
            }
          }
      }.bind(this)
    );
  },
  methods: {
    onTestData() {
      let testData = {
        type: "cc_Node",
        uuid: "5cUWX4Yh1MipGk+ssnZ/fL",
        name: "Canvas",
        x: 960,
        y: 540.4931506849315,
        zIndex: 0,
        childrenCount: 6,
        children: [],
        width: 1920,
        height: 1080.986301369863,
        color: "#fff85f",
        opacity: 255,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        anchorX: 0.5,
        anchorY: 0.5,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        components: [
          {
            uuid: "Comp.931",
            type: "cc_Canvas",
            name: "Canvas<Canvas>"
          },
          {
            uuid: "Comp.932",
            type: "HotUpdateScene",
            name: "Canvas<HotUpdateScene>"
          }
        ],
        active: true
      };
      this.treeItemData = testData;
    },
    _generateTreeData(data) {
      let treeData = [];
      let sceneData = data.scene;
      if (sceneData) {
        // scene info
        let dataRoot = {
          type: sceneData.type,
          uuid: sceneData.uuid,
          label: sceneData.name,
          components: sceneData.components,
          children: [],
        };
        treeData.push(dataRoot);

        // scene children info
        for (let itemSceneData of sceneData.children) {
          let sceneItem = {};
          dealChildrenNode(itemSceneData, sceneItem);
          treeData[0].children.push(sceneItem);
        }
      }

      function dealChildrenNode(rootData, obj) {
        obj["data"] = rootData;
        obj["uuid"] = rootData.uuid;
        obj["label"] = rootData.name;
        obj["active"] = rootData.active;
        obj["components"] = rootData.components;
        obj["children"] = [];
        let rootChildren = rootData.children;
        for (let itemData of rootChildren) {
          let item = {};
          dealChildrenNode(itemData, item);
          obj.children.push(item);
        }
      }

      return treeData;
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
          if (oldchildren[i].label != newchildren[i].label) {
            oldchildren[i].label = newchildren[i].label
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
        this.treeData = this._generateTreeData(data);
        this._freshNode(this.treeData[0].uuid);
      } else {
        let newTree = this._generateTreeData(data);
        this._updateTree(this.treeData[0], newTree[0]);
      }
    },
    _getInjectScriptString(script) {
      // PS:脚本代码行数过多会读不进来，目前测试为230行
      let code = script.toString();
      let array = code.split("\n");
      console.log(array);
      // 删除开头function() {
      array.splice(0, 1);
      while (array[0].indexOf("//") != -1) {
        array.splice(0, 1);
      }
      // 删除结尾} 使函数直接注入
      array.splice(-1, 1);
      let evalCode = "";
      // 防止注释使代码失效
      for (let i = 0; i < array.length; i++) {
        evalCode += array[i] + "\n";
      }
      // console.log(evalCode);
      return evalCode;
    },
    onBtnClickUpdatePage() {
      code = this._getInjectScriptString(injectUtil);
      chrome.devtools.inspectedWindow.eval(code);
      let code = this._getInjectScriptString(injectPlugin);
      chrome.devtools.inspectedWindow.eval(code);
      code = this._getInjectScriptString(injectConnect);
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
        this._evalCode("window.showGraphics()");
      } else {
        this._evalCode("window.hiddenGraphics()");
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
