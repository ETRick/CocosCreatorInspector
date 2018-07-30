<template>
  <div id="app">
    <el-button type="success" class="el-icon-refresh" size="mini" @click="onBtnClickUpdatePage">刷新</el-button>
    <!--<el-button type="success" size="mini" @click="onTestData">测试</el-button>-->
    <!--<el-button type="success" size="mini" @click="onBtnClickTest">test</el-button>-->
    <div v-show="isShowDebug">
      <el-row>
        <el-col :span="8">
          <div class="grid-content treeList">
            <el-tree :data="treeData"
                     :props="defaultProps"
                     :expand-on-click-node="true"
                     node-key="uuid"
                     highlight-current
                     :render-content="renderTreeContent"
                     @node-click="handleNodeClick"></el-tree>
          </div>
        </el-col>
        <el-col :span="16">
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
  import injectPluginInit from '../injectedScripts/pluginInit.js'
  import injectConnectInit from '../injectedScripts/connectInit.js'
  import injectScript from '../injectedScripts/injectScript.js'

  export default {
    name: "app",
    data() {
      return {
        isShowDebug: false,
        treeItemData: {},
        treeData: [],
        oldTreeData: [],
        treeDataMap: {},
      }
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
      
      backgroundPageConnection.onMessage.addListener(function (message) {
        // console.log("getInfo:", message);
        if (message !== null) {
          let msgType = {
            refleshInfo: 3, // 节点刷新信息
            nodeInfo: 2, // 节点信息
            nodeListInfo: 1, // 节点列表信息
            notSupport: 0, // 不支持的游戏
          };
          if (message.type === msgType.nodeListInfo) { // 游戏树节点
            this.isShowDebug = true;
            // let str = JSON.stringify(message.msg);
            // console.log("onMessage: " + str);
            this._updateView(message.msg);
          } else if (message.type === msgType.notSupport) { // 不支持调试
            this.isShowDebug = false;
          } else if (message.type === msgType.nodeInfo) { // 获取节点属性信息
            this.isShowDebug = true;
            // console.log("msg:", message.msg);
            this.treeItemData = message.msg;
          } else if (message.type === msgType.refleshInfo) { // 刷新节点
            this._freshNode(this.treeItemData.uuid);
          }
        }
      }.bind(this));
    },
    methods: {
      onTestData() {
        let testData = {
          "type": "cc_Node",
          "uuid": "5cUWX4Yh1MipGk+ssnZ/fL",
          "name": "Canvas",
          "x": 960,
          "y": 540.4931506849315,
          "zIndex": 0,
          "childrenCount": 6,
          "children": [],
          "width": 1920,
          "height": 1080.986301369863,
          "color": "#fff85f",
          "opacity": 255,
          "rotation": 0,
          "rotationX": 0,
          "rotationY": 0,
          "anchorX": 0.5,
          "anchorY": 0.5,
          "scaleX": 1,
          "scaleY": 1,
          "skewX": 0,
          "skewY": 0,
          "components": [
            {
              "uuid": "Comp.931",
              "type": "cc_Canvas",
              "name": "Canvas<Canvas>"
            },
            {
              "uuid": "Comp.932",
              "type": "HotUpdateScene",
              "name": "Canvas<HotUpdateScene>"
            }],
          "active": true
        };
        this.treeItemData = testData;
      },
      handleNodeClick(data) {
        // todo 去获取节点信息
        // console.log("click:", data);
        this._freshNode(data.uuid);
      },
      // 增加树节点
      addTreeNode() {

      },
      // 删除树节点
      deleteTreeNode() {

      },
      // 渲染树节点
      renderTreeContent() {

      },
      // 更新树，如果出现更新，返回true
      _updateTree(oldtree, newtree) {
        let update = false;
        for (let i = 0; i < newtree.length; i++) {
          if (typeof oldtree[i] == 'undefined') {
            update = true;
            oldtree.push(newtree[i]);
          } else if (oldtree[i].uuid != newtree[i].uuid) {
            update = true;
            oldtree[i].uuid = newtree[i].uuid;
            oldtree[i].name = newtree[i].name;
          }
          update = update || this._updateTree(oldtree[i].children, newtree[i].children);
        }
        oldtree.splice(newtree.length, newtree.length - oldtree.length);
        return update || newtree.length != oldtree.length;
      },
      _generateTreeData(data) {
        let treeData = [];
        let sceneData = data.scene;
        if (sceneData) {
          // console.log(sceneData);
          // scene info
          let dataRoot = {
            type: sceneData.type,
            uuid: sceneData.uuid,
            label: sceneData.name,
            children: []
          };
          treeData.push(dataRoot);
          // this.handleNodeClick(dataRoot);
          // scene children info
          for (let itemSceneData of sceneData.children) {
            // let sceneItem = {uuid: itemSceneData.uuid, label: itemSceneData.name, children: []};
            let sceneItem = {};
            dealChildrenNode(itemSceneData, sceneItem);
            treeData[0].children.push(sceneItem);
          }
        }

        function dealChildrenNode(rootData, obj) {
          obj['data'] = rootData;
          obj['uuid'] = rootData.uuid;
          obj['label'] = rootData.name;
          obj['type'] = rootData.type;
          obj['children'] = [];
          let rootChildren = rootData.children;
          for (let itemData of rootChildren) {
            let item = {};
            dealChildrenNode(itemData, item);
            obj.children.push(item);
          }
        }

        return treeData;
      },
      _updateView(data) {
        // TODO 节点树折叠的问题
        if (JSON.stringify(this.treeData) !== "[]") { // 更新值
          let newtree = this._generateTreeData(data);
          if (this._updateTree(this.oldTreeData, newtree)) {
            this._updateTree(this.treeData, this.oldTreeData);
          }
        } else { // 第一次赋值
          // 构建树形数据
          this.treeData = this._generateTreeData(data);
          this._updateTree(this.oldTreeData, this.treeData);
          this.handleNodeClick({uuid: this.treeData[0].uuid});
        }
      },
      _getInjectScriptString(script) {
        // PS:脚本代码行数过多会读不进来，目前测试为230行
        let code = script.toString();
        let array = code.split('\n');
        // 删除开头function() {
        array.splice(0, 1);
        // 删除结尾} 使函数直接注入
        array.splice(-1, 1);
        let evalCode = "";
        // 防止注释使代码失效
        for (let i = 0; i < array.length; i++) {
          evalCode += array[i] + '\n';
        }
        // console.log(evalCode);
        return evalCode;
      },

      onBtnClickUpdatePage() {
        let code = this._getInjectScriptString(injectPluginInit);
        chrome.devtools.inspectedWindow.eval(code);
        code = this._getInjectScriptString(injectConnectInit);
        chrome.devtools.inspectedWindow.eval(code);
        code = this._getInjectScriptString(injectScript);
        chrome.devtools.inspectedWindow.eval(code, function () {
          console.log("刷新成功!");
        });
      },
    }
  }
</script>

<style scoped>
  .treeList {
    height: 100%
  }

  .treeInfo {
    height: 100%
  }

  .bg-purple {
    background: #d3dce6;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 20px;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  body span h1 h2 h3 {
    font-family: BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Lucida Grande', 'Segoe UI', Ubuntu, Cantarell, 'SourceHanSansCN-Normal', Arial, sans-serif
  }
</style>
