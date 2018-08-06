// Author: huzi(moustache)
// Date: 18-7-27 11:10
// Description: 此文件保存window函数属性的初始化。
//  并且，此处的函数会在运行时被注入到页面。
export default function () {
  // 初始化内存
  window.inspectorGameMemoryStorage = window.inspectorGameMemoryStorage || {};

  // 暂停游戏
  window.pluginPauseGame = function () {
    cc.director.pause();
  };

  // 恢复游戏
  window.pluginResumeGame = function () {
    cc.director.resume();
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
    let scene;
    // 区分版本
    switch (cc.ENGINE_VERSION.substr(0, 3)) {
      // 1.4版本中，没有scene的uuid，因此忽略
      case "1.4":
        {
          scene = cc.director.getScene().children[0];
          break;
        }
        // 1.9 2.0版本中有scene的uuid
      default:
        {
          scene = cc.director.getScene().children[0];
          break;
        }
    }

    if (scene) {
      let postData = {
        scene: {},
      };

      postData.scene = {
        type: window.Connect.msgType.nodeListInfo, // 标识类型
        uuid: scene.uuid,
        name: scene.name,
        active: scene.active,
        components: [],
        children: [],
      };
      window.inspectorGameMemoryStorage[scene.uuid] = scene;

      let coms = scene._components;
      for (let com of coms) {
        postData.scene.components.push(com.__classname__);
      }

      let sceneChildren = scene.getChildren();
      for (let i = 0; i < sceneChildren.length; i++) {
        let node = sceneChildren[i];
        getNodeChildren(node, postData.scene.children);
      }
      // console.log(postData);
      window.sendMsgToDevTools(window.Connect.msgType.nodeListInfo, postData);
    } else {
      postData.scene = null;
      window.sendMsgToDevTools(window.Connect.msgType.notSupport, "不支持调试游戏!");
    }
  };

  // 收集节点树的儿子信息
  function getNodeChildren(node, arr) {
    window.inspectorGameMemoryStorage[node.uuid] = node;
    // console.log("nodeName: " + node.name);
    let nodeData = {
      uuid: node.uuid,
      name: node.name,
      active: node.active,
      components: [],
      children: [],
    };

    let coms = node._components;
    for (let com of coms) {
      nodeData.components.push(com.__classname__);
    }

    let nodeChildren = node.getChildren();
    for (let childItem of nodeChildren) {
      // console.log("childName: " + childItem.name);
      getNodeChildren(childItem, nodeData.children);
    }
    arr.push(nodeData);
  }

  // 获取节点信息
  window.getNodeInfo = function (uuid) {
    let node = window.inspectorGameMemoryStorage[uuid];
    if (node) {
      let nodeComps = getNodeComponentsInfo(node);
      let nodeData = window.Connect.Node(node);
      nodeData.components = nodeComps;
      window.sendMsgToDevTools(window.Connect.msgType.nodeInfo, nodeData);
    } else {
      // 未获取到节点数据
      console.log("未获取到节点数据");
    }
  };

  // 收集组件信息
  function getNodeComponentsInfo(node) {
    let ret = [];
    let nodeComp = node._components;
    for (let i = 0; i < nodeComp.length; i++) {
      let com = nodeComp[i];
      window.inspectorGameMemoryStorage[com.uuid] = com;
      ret.push(window.Connect.Component(com));
    }
    return ret;
  }

  // 显示DOM边框，并去除之前的DOM边框
  window.changeDOMBorder = (function () {
    let olddom;
    return function (uuidordom) {
      let config = window.Config.DEBUG_MODE;
      let newdom = typeof uuidordom == 'string' ? $.getDOMElement(uuidordom) : uuidordom;
      // 防止循环递归
      if (olddom && olddom != newdom) {
        olddom.css('border-color', config.showCustomBorder ? config.customBorderColor : '#00000000');
      }
      // 防止节点被删除
      if (newdom.length != 0) {
        newdom.css('border-color', config.clickedBroderColor);
        olddom = newdom;
      }
    };
  })();

  // 显示DOM树，只显示指定节点的DOM树
  window.showDOM = function (uuid) {
    if (uuid) {
      let node = $.getDOMElement(uuid);
      node.css("visibility", "visible");
    }
  };

  // 隐藏DOM树，只隐藏指定节点的DOM树
  window.hiddenDOM = function (uuid) {
    // 去除DOM边框
    if (uuid) {
      let node = $.getDOMElement(uuid);
      // 父节点不能设置inherit
      let attr = uuid == cc.Canvas.instance.node.uuid ? "hidden" : "inherit";
      node.css("visibility", attr);
    }
  };

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