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
          scene = cc.director.getScene();
          break;
        }
    }

    if (scene) {
      let postRoot = [];
      // 递归整棵树
      let fix = f => f(f);
      (fix(fact => (node, arr) => {
        // 收集节点信息
        let postNode = window.Connect.TreeNode(node);
        // 组件信息
        node._components.forEach(com => {
          postNode.components.push(com.__classname__)
        });
        // 儿子信息
        node.getChildren().forEach(childItem => {
          // 忽略graphicsNode
          if (!window.quadRoot || childItem.uuid != window.graphicsNode.uuid) {
            fact(fact)(childItem, postNode.children);
          }
        });
        arr.push(postNode);
      }))(scene, postRoot);
      // 发送数据
      window.sendMsgToDevTools(window.Connect.msgType.nodeListInfo, postRoot);
    } else {
      window.sendMsgToDevTools(window.Connect.msgType.notSupport, "不支持调试游戏!");
    }

  };

  // 获取节点信息
  window.getNodeInfo = function (uuid) {
    let node = window.inspectorGameMemoryStorage[uuid];
    if (node) {
      let nodeData = window.Connect.Node(node);
      nodeData.components = getNodeComponentsInfo(node);
      window.sendMsgToDevTools(window.Connect.msgType.nodeInfo, nodeData);
    } else {
      // 未获取到节点数据
      console.log("未获取到节点数据");
    }
  };

  // 收集组件信息
  function getNodeComponentsInfo(node) {
    let ret = [];
    node._components.forEach(com => {
      ret.push(window.Connect.Component(com))
    });
    return ret;
  }

  // 显示Graphics节点
  window.showGraphics = function () {
    let node = cc.Canvas.instance.node.parent.getChildByName("Debug-Graphics");
    if (node) {
      node.active = true;
    }
  };

  // 隐藏Graphics节点
  window.hiddenGraphics = function () {
    let node = cc.Canvas.instance.node.parent.getChildByName("Debug-Graphics");
    if (node) {
      node.active = false;
    }
  };

  // 显示QuadRangle边框，并去除之前的QuadRangle边框
  window.clickQuadNode = function (uuid) {
    let quadnode = window.quadNodeStorage[uuid];
    if (quadnode && QuadNode.clicked != quadnode) {
      QuadNode.clicked = quadnode;
    }
  };

  // 修改节点树种节点的层级
  window.changeNodeTree = function (fromUuid, toUuid, type) {
    let fromNode = window.inspectorGameMemoryStorage[fromUuid];
    let toNode = window.inspectorGameMemoryStorage[toUuid];
    if (fromNode && toNode) {
      console.log(fromNode, toNode);
      // 移除原来的节点
      fromNode.removeFromParent(false);
      if (type == "inner") {
        // 插入内部
        toNode.addChild(fromNode);
      } else {
        // 插入同级别
        let parent = toNode.parent;
        // after时，位置需要+1
        let index = parent.children.indexOf(toNode) + (type == "after");
        parent.insertChild(fromNode, index);
      }
    }
  };

  // 向devtools发送信息
  window.sendMsgToDevTools = function (type, msg) {
    window.postMessage({
      type: type,
      msg: msg
    }, "*");
  };
}