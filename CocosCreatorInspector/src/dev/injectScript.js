// eval 注入脚本的代码,变量尽量使用var,后来发现在import之后,let会自动变为var
export default function () {
  let msgType = {
    nodeInfo: 2, //节点信息
    nodeListInfo: 1, // 节点列表信息
    notSupport: 0, // 不支持的游戏
  };
  let postData = {
    scene: {
      name: "",
      children: []
    },
  };
  window.inspectorGameMemoryStorage = window.inspectorGameMemoryStorage || {};

  // 用于通讯结构构造
  window.connectConstructor = {
    // 组件构造：只要变量，不要函数。最终包含：
    //   type
    //   name
    //   uuid
    //   enable
    //   ...
    //     自定义变量
    //   ...
    Component(com) {
      if (com instanceof cc.Component) {
        let filterCom = {
          comptype: com.constructor.name,
          enable: com.enable,
        };
        console.log(filterCom, "\n\n\n");
        for (let key in com) {
          let value = com[key];
          if (key[0] != "_" && typeof value != "function") {
            // console.log(key, value);
            // object节点无法通过post进行复制，因此在此处修改
            if (value instanceof cc.Object || value instanceof cc.Action) {
              filterCom[key] = {
                name: value.name,
                uuid: value.uuid,
              };
            } else {
              filterCom[key] = value;
            }
            console.log(key, filterCom[key]);
          }
          // 到姓名结束
          if (key == "name") {
            break;
          }
        }
        // console.log(filterCom);
        return filterCom;
      }
    },
    // 节点构造
    Node(node) {
      if (node instanceof cc.Node) {
        return {
          type: node.constructor.name,
          uuid: node.uuid,
          name: node.name,
          x: node.x,
          y: node.y,
          zIndex: node.zIndex,
          childrenCount: node.childrenCount,
          children: [],
          width: node.width,
          height: node.height,
          color: node.color.toCSS(),
          opacity: node.opacity,
          rotation: node.rotation,
          rotationX: node.rotationX,
          rotationY: node.rotationY,
          anchorX: node.anchorX,
          anchorY: node.anchorY,
          scaleX: node.scaleX,
          scaleY: node.scaleY,
          skewX: node.skewX,
          skewY: node.skewY,
        };
      }
    }
  };

  // 收集组件信息
  function getNodeComponentsInfo(node) {
    let ret = [];
    let nodeComp = node._components;
    for (let i in nodeComp) {
      let com = nodeComp[i];
      window.inspectorGameMemoryStorage[com.uuid] = com;
      ret.push(window.connectConstructor.Component(com));
    }
    return ret;
  }

  // 设置节点状态（通过函数） func's type: void func(node)
  window.pluginSetNode = function (uuid, func) {
    let node = window.inspectorGameMemoryStorage[uuid];
    if (node) {
      func(node);
    }
  }

  // 设置节点状态（通过key-value）
  window.pluginSetNodeValue = function (uuid, key, value) {
    let node = window.inspectorGameMemoryStorage[uuid];
    if (node) {
      // this.console.log(key, node[key]);
      node[key] = value;
    }
  }

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
    if (node) {
      if (isActive === true) {
        node.active = true;
      } else if (isActive === false) {
        node.active = false;
      }
    }
  };
  // 获取节点信息
  window.getNodeInfo = function (uuid) {
    let node = window.inspectorGameMemoryStorage[uuid];
    if (node) {
      let nodeComps = getNodeComponentsInfo(node);
      let nodeData = window.connectConstructor.Node(node);
      console.log("components:", nodeComps);
      nodeData.components = nodeComps;
      if (!node instanceof cc.Scene) {
        nodeData.active = node.active;
      }
      // console.log("send:", nodeData);
      window.sendMsgToDevTools(msgType.nodeInfo, nodeData);
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

  window.sendMsgToDevTools = function (type, msg) {
    // this.console.log("type:", type);
    // this.console.log("meg:", msg);
    top.postMessage({
      type: type,
      msg: msg
    }, "*");
  };

  // 检测是否包含cc变量
  let isCocosCreatorGame = true;
  try {
    let cocosInspectorTestVar = cc;
  } catch (e) {
    isCocosCreatorGame = false;
    window.sendMsgToDevTools(msgType.notSupport, "不支持调试游戏!");
  }

  // 存在cc空间，游戏存在
  if (isCocosCreatorGame) {
    // console.log("enter?");
    let scene = cc.director.getScene();
    if (scene) {
      postData.scene = {
        type: msgType.nodeListInfo, // 标识类型
        uuid: scene.uuid,
        name: scene.name,
        children: [],
      };
      window.inspectorGameMemoryStorage[scene.uuid] = scene;

      let sceneChildren = scene.getChildren();
      for (let node of sceneChildren) {
        getNodeChildren(node, postData.scene.children);
      }
      console.log(postData);
      window.sendMsgToDevTools(msgType.nodeListInfo, postData);
    } else {
      postData.scene = null;
      window.sendMsgToDevTools(msgType.notSupport, "不支持调试游戏!");
    }
  } else {
    console.log("未发现cocos creator game");
  }
}
