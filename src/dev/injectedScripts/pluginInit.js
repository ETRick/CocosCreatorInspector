// Author: huzi(moustache)
// Date: 18-7-27 11:10
// Description: 此文件保存window函数属性的初始化。
//  并且，此处的函数会在运行时被注入到页面。
export default function () {
  // 初始化内存
  window.inspectorGameMemoryStorage = window.inspectorGameMemoryStorage || {};

  // 暂停游戏
  window.pluginPauseGame = function () {
    window.initialIsPaused = cc.game.isPaused();
    cc.game.pause();
  };

  // 恢复游戏
  window.pluginResumeGame = function () {
    if (!window.initialIsPaused) {
      cc.game.resume();
    }
  };

  // 设置节点状态（通过key-value）
  window.pluginSetNodeValue = function (uuid, key, value) {
    let node = window.inspectorGameMemoryStorage[uuid];
    // console.log("SetNodeValue:", uuid, node, key, value);
    if (node) {
      // 判断类型
      if (typeof node[key] == 'number') {
        node[key] = parseFloat(value);
      } else {
        node[key] = value;
      }
    }
  };

  // 设置节点颜色
  window.pluginSetNodeColor = function (uuid, colorHex) {
    let node = window.inspectorGameMemoryStorage[uuid];
    if (node) {
      node.color = node.color.fromHEX(colorHex);
    }
  };

  // 设置节点是否可视
  window.pluginSetNodeActive = function (uuid, isActive) {
    let node = window.inspectorGameMemoryStorage[uuid];
    if (node && typeof isActive == 'boolean') {
      node.active = isActive;
    }
  };

  // 发送节点信息
  window.sendNodeTreeInfo = function () {
    let scene = cc.director.getScene();
    if (scene) {
      let postData = {
        scene: {
          name: "",
          children: []
        },
      };

      postData.scene = {
        type: window.Connect.msgType.nodeListInfo, // 标识类型
        uuid: scene.uuid,
        name: scene.name,
        children: [],
      };
      window.inspectorGameMemoryStorage[scene.uuid] = scene;

      let sceneChildren = scene.getChildren();
      for (let node of sceneChildren) {
        getNodeChildren(node, postData.scene.children);
      }
      // console.log(postData);
      window.sendMsgToDevTools(window.Connect.msgType.nodeListInfo, postData);
    } else {
      postData.scene = null;
      window.sendMsgToDevTools(window.Connect.msgType.notSupport, "不支持调试游戏!");
    }
  };

  // 获取节点信息
  window.getNodeInfo = function (uuid) {
    let node = window.inspectorGameMemoryStorage[uuid];
    if (node) {
      let nodeComps = getNodeComponentsInfo(node);
      let nodeData = window.Connect.Node(node);
      // console.log("components:", nodeComps);
      nodeData.components = nodeComps;
      if (node instanceof cc.Scene) {
        delete nodeData.active;
      }
      // console.log("send:", nodeData);
      window.sendMsgToDevTools(window.Connect.msgType.nodeInfo, nodeData);
    } else {
      // 未获取到节点数据
      console.log("未获取到节点数据");
    }
  };

  // 收集节点信息
  function getNodeChildren(node, data) {
    // console.log("nodeName: " + node.name);
    let nodeData = {
      uuid: node.uuid,
      name: node.name,
      children: [],
    };
    window.inspectorGameMemoryStorage[node.uuid] = node;
    let nodeChildren = node.getChildren();
    for (let childItem of nodeChildren) {
      // console.log("childName: " + childItem.name);
      getNodeChildren(childItem, nodeData.children);
    }
    data.push(nodeData);
  }

  // 收集组件信息
  function getNodeComponentsInfo(node) {
    let ret = [];
    let nodeComp = node._components;
    for (let i in nodeComp) {
      let com = nodeComp[i];
      window.inspectorGameMemoryStorage[com.uuid] = com;
      ret.push(window.Connect.Component(com));
    }
    return ret;
  }

  // 向devtools发送信息
  window.sendMsgToDevTools = function (type, msg) {
    // this.console.log("type:", type);
    // this.console.log("meg:", msg);
    window.postMessage({
      type: type,
      msg: msg
    }, "*");
  };
}