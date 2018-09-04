// Author: huzi(moustache)
// Date: 18-7-27 11:10
// Description: 此文件负责ccIns接口函数的声明和定义。
//  此处的函数会被devtools端使用。
export default function () {
  if (typeof ccIns == "undefined") {
    ccIns = {};
  }

  // 暂停游戏
  ccIns.pauseGame = function () {
    cc.director.pause();
  };

  // 恢复游戏
  ccIns.resumeGame = function () {
    cc.director.resume();
  };

  // 设置节点状态（通过key-value）
  //  其中节点可以单层或者多层递进(使用数组)
  //  例如：
  //     node.b --- key == b
  //     node.b.c.d[1] --- keys == [b, c, d, 1]
  ccIns.setNodeValue = function (uuid, keyorkeys, value) {
    let node = ccIns.getObjectFromStorage(uuid, "node");
    if (node) {
      if (!(keyorkeys instanceof Array)) {
        let key = keyorkeys;
        // 防止出现NAN
        if (typeof node[key] == "number" && !isNaN(parseFloat(value))) {
          node[key] = parseFloat(value);
        } else {
          node[key] = value;
        }
      } else {
        let keys = keyorkeys;
        let i = 0;
        for (; i < keys.length - 1; i++) {
          node = node[keys[i]];
          if (!node) {
            return;
          }
        }
        // 防止出现NAN
        if (typeof node[keys[i]] == "number" && !isNaN(parseFloat(value))) {
          node[keys[i]] = parseFloat(value);
        } else {
          node[keys[i]] = value;
        }
      }
    }
  };

  // 设置节点中数组的长度
  ccIns.setNodeArrayLength = function (uuid, arraykey, length) {
    let node = ccIns.getObjectFromStorage(uuid, "node");
    if (node) {
      let oneElement = ccIns.getObjectFromStorage(uuid, arraykey + "type");
      if (!oneElement && node[arraykey].length > 0) {
        oneElement = node[arraykey][0];
        ccIns.addObjectToStorage(uuid, arraykey + "type", oneElement);
      }
      node[arraykey].resize(length, getDefaultValue(oneElement));
    }

    // 通过其中一个元素得到该类型的默认值
    function getDefaultValue(oneElement) {
      // 处理null和undefined
      if (oneElement === undefined || oneElement === null) {
        return null;
      }

      // 处理cctype
      if (oneElement.__classname__) {
        let type = oneElement.__classname__.substr(3);
        return cc[type]();
      }

      // 基本类型
      if (typeof oneElement == "boolean") {
        return false;
      } else if (typeof oneElement == "number") {
        return 0;
      } else if (typeof oneElement == "string") {
        return "";
      }
      return null;
    }
  };

  // 设置节点颜色
  ccIns.setNodeColor = function (uuid, colorHex) {
    let node = ccIns.getObjectFromStorage(uuid, "node");
    if (node) {
      node.color = node.color.fromHEX(colorHex);
    }
  };

  // 设置节点是否可视
  ccIns.setNodeActive = function (uuid, isActive) {
    let node = ccIns.getObjectFromStorage(uuid, "node");
    if (node && typeof isActive == 'boolean') {
      node.active = isActive;
    }
  };

  // 发送节点信息
  ccIns.sendNodeTreeInfo = function () {
    let scene = cc.director.getScene();

    if (scene) {
      let postRoot = [];
      // 递归整棵树
      let fix = f => f(f);
      (fix(fact => (node, arr) => {
        // 收集节点和组件信息
        let postNode = ccIns.Connect.TreeNode(node);
        // 儿子信息
        node.getChildren().forEach(childItem => {
          // 忽略graphicsNode
          if (!ccIns.graphicsNode || childItem.uuid != ccIns.graphicsNode.uuid) {
            fact(fact)(childItem, postNode.children);
          }
        });
        arr.push(postNode);
      }))(scene, postRoot);
      // 发送数据
      ccIns.sendMsgToDevTools(ccIns.Connect.msgType.nodeListInfo, postRoot);
    } else {
      ccIns.sendMsgToDevTools(ccIns.Connect.msgType.notSupport, "不支持调试游戏!");
    }
  };

  // 获取节点信息
  ccIns.getNodeInfo = function (uuid) {
    let node = ccIns.getObjectFromStorage(uuid, "node");
    if (node) {
      // 判断是节点还是脚本（Scene不存在脚本）
      if (!(node instanceof cc.Node || node instanceof cc.Scene)) {
        node = node.node;
      }

      let nodeData = ccIns.Connect.CustomType(node);
      nodeData.value.components = ccIns.Connect.CustomType(node._components);
      ccIns.sendMsgToDevTools(ccIns.Connect.msgType.nodeInfo, nodeData);
    } else {
      // 未获取到节点数据
      console.log("未获取到节点数据");
    }
  };

  // 显示Graphics节点
  ccIns.showGraphics = function () {
    let node = cc.Canvas.instance.node.parent.getChildByName("Debug-Graphics");
    if (node) {
      node.active = true;
    }
  };

  // 隐藏Graphics节点
  ccIns.hiddenGraphics = function () {
    let node = cc.Canvas.instance.node.parent.getChildByName("Debug-Graphics");
    if (node) {
      node.active = false;
    }
  };

  // 显示QuadRangle边框，并去除之前的QuadRangle边框
  ccIns.clickQuadNode = function (uuid) {
    // 点击时将点击节点暂存在ccIns.n0变量中
    ccIns.n0 = ccIns.getObjectFromStorage(uuid, "node");

    let quadnode = ccIns.getObjectFromStorage(uuid, "quadNode");
    if (quadnode && ccIns.QuadNode.clicked != quadnode) {
      ccIns.QuadNode.clicked = quadnode;
    }
  };

  // 修改节点树中节点的层级
  ccIns.changeNodeTree = function (fromUuid, toUuid, type) {
    let fromNode = ccIns.getObjectFromStorage(fromUuid, "node");
    let toNode = ccIns.getObjectFromStorage(toUuid, "node");
    if (fromNode && toNode) {
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
  ccIns.sendMsgToDevTools = function (type, msg) {
    window.postMessage({
      type: type,
      msg: msg
    }, "*");
  };
}