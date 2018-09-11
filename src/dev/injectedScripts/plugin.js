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
      // key: 直接赋值
      let key = keyorkeys;
      // keys: 先进行递归找到对应的node和key
      if (keyorkeys instanceof Array) {
        let keys = keyorkeys;
        let i = 0;
        for (; i < keys.length - 1; i++) {
          node = node[keys[i]];
          if (!node) {
            return;
          }
        }
        key = keys[i];
      }

      if (typeof node[key] == "number" && !isNaN(parseFloat(value))) {
        // number, 防止出现NAN
        node[key] = parseFloat(value);
      } else if (node[key].__classname__ && ["Vec2", "Vec3", "Size"].hasValue(node[key].__classname__.substr(3))) {
        // vector或者是size
        node[key] = new cc[node[key].__classname__.substr(3)](value);
      } else {
        node[key] = value;
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
      node[arraykey].resize(length, produceDefaultValueFunc(oneElement));
    }

    // 通过其中一个元素得到该类型的默认值
    //   返回的是函数，用来产生默认值，防止object时物体时push失效
    function produceDefaultValueFunc(oneElement) {
      // 处理null和undefined
      if (oneElement === undefined || oneElement === null) {
        return () => null;
      }

      // 处理cctype
      if (oneElement.__classname__) {
        let type = oneElement.__classname__.substr(3);
        return cc[type] && ["Vec2", "Vec3", "Size"].hasValue(type) ? () => new cc[type]() : () => null;
      }

      // 基本类型
      if (typeof oneElement == "boolean") {
        return () => false;
      } else if (typeof oneElement == "number") {
        return () => 0;
      } else if (typeof oneElement == "string") {
        return () => "";
      }
      return () => null;
    }
  };

  // 设置节点颜色
  ccIns.setNodeColor = function (uuid, key, colorHex) {
    let node = ccIns.getObjectFromStorage(uuid, "node");
    if (node) {
      node[key] = node[key].fromHEX(colorHex);
    }
  };

  // 显示Graphics节点
  ccIns.showGraphics = function () {
    let node = ccIns.graphicsNode;
    if (node) {
      node.active = true;
    }
  };

  // 隐藏Graphics节点
  ccIns.hiddenGraphics = function () {
    let node = ccIns.graphicsNode;
    if (node) {
      node.active = false;
    }
  };

  // 显示QuadRangle边框，并去除之前的QuadRangle边框
  ccIns.clickQuadNode = function (uuid) {
    // 点击时将点击节点暂存在ccIns.n0变量中，将组件暂存在ccIns.cs中
    ccIns.n0 = ccIns.getObjectFromStorage(uuid, "node");
    ccIns.cs = ccIns.n0._components;

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
    // 为了提升用户体验，每次运行getNodeInfo后，都将节点计时器清零
    ccIns.Timer.node.clearTime();

    let node = ccIns.getObjectFromStorage(uuid, "node");
    if (node) {
      // 判断是节点还是脚本（Scene不存在脚本）
      if (!(node instanceof cc.Node || node instanceof cc.Scene)) {
        node = node.node;
      }

      let nodeData = ccIns.Connect.CustomType(node);
      // 每个组件手动push，防止出现递归导致未显示某些组件的bug
      nodeData.value.components = {type: "Array", value: []};
      for (let comp of node._components) {
        nodeData.value.components.value.push(ccIns.Connect.CustomType(comp));
      }
      ccIns.sendMsgToDevTools(ccIns.Connect.msgType.nodeInfo, nodeData);
    } else {
      // 未获取到节点数据
      console.log("未获取到节点数据");
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