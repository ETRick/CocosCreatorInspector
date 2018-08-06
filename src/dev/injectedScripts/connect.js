// Author: huzi(moustache)
// Date: 18-7-27 11:19
// Description: 此文件保存window.Connect，用于通讯。
export default function () {
  // 用于通讯结构构造
  window.Connect = {
    // 通讯类型定义
    msgType: {
      clickedNodeInfo: 4, // 出现节点被点击
      refleshInfo: 3, // 节点刷新信息
      nodeInfo: 2, // 节点信息
      nodeListInfo: 1, // 节点列表信息
      notSupport: 0, // 不支持的游戏
    },
    // 组件构造：构造自定义组件。
    Component(com) {
      if (com instanceof cc.Component) {
        let filterCom = {
          comptype: com.__classname__,
          uuid: com.uuid,
          enabled: com.enabled
        };
        // console.log("com:", com);
        // 过滤掉私有值和函数的值
        for (let key of Object.keys(com)) {
          let value = com[key];
          if (key[0] != "_" && typeof value != "function" && !(value instanceof Array)) {
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
            // console.log(key, filterCom[key]);
          }
        }
        // console.log("filtercom:", filterCom);
        return filterCom;
      }
    },
    // 节点构造：构造自定义节点
    Node(node) {
      if (node instanceof cc.Node) {
        let rtnNode = {
          type: node.__classname__,
          uuid: node.uuid,
          name: node.name,
          x: node.x,
          y: node.y,
          // zIndex: node.zIndex,
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
        // scene没有active
        if (!(node instanceof cc.Scene)) {
          rtnNode.active = node.active;
        }
        return rtnNode;
      }
    }
  };
}
