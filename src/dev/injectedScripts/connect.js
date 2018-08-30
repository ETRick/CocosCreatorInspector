// Author: huzi(moustache)
// Date: 18-7-27 11:19
// Description: 此文件保存ccIns.Connect，用于通讯。
export default function () {
  // 用于通讯结构构造
  ccIns.Connect = {
    // 通讯类型定义
    msgType: {
      notSupport: 0, // 不支持的游戏
      nodeListInfo: 1, // 节点列表信息
      nodeInfo: 2, // 节点信息
      refleshInfo: 3, // 节点刷新信息
      clickedNodeInfo: 4, // 出现节点被点击
      refleshDocument: 5, // 出现页面刷新
      enumType: 6, // 节点中的枚举信息
    },
    // 通过过滤函数，过滤不想取得的key值
    CCType(obj, filterFunc) {
      let rtnObj = {};
      let objType = obj.__classname__.substr(3);
      // 通过__props__获得key值
      for (let key of cc[objType].__props__) {
        // 忽略私有变量和函数
        if ((typeof filterFunc == "undefined" || filterFunc(key)) && ccIns.isPublicVar(obj, key)) {
          rtnObj[key] = ccIns.Connect.CustomType(obj[key]);
        }
      }
      return rtnObj;
    },
    CustomType(obj) {
      // null
      if (obj === null) {
        return {
          type: "null",
          value: null,
        };
      }

      // cc内部结构
      if (ccIns.isCCType(obj)) {
        let type = obj.__classname__.substr(3);
        // 如果是自己适配过的cc类型，使用自己的构造函数
        // 不是自己适配过的cc类型，使用公有构造函数
        let value = ccIns.Connect[type] ? ccIns.Connect[type](obj) : ccIns.Connect.CCType(obj);
        return {
          type: type,
          value: value,
        };
      }

      // 自定义的脚本
      if (obj.__classname__) {
        return ccIns.Connect.CustomComponent(obj);
      }

      // Array
      if (obj instanceof Array) {
        // 数组类型
        let rtnObj = [];
        for (let item of obj) {
          rtnObj.push(ccIns.Connect.CustomType(item));
        }
        return {
          type: "Array",
          value: rtnObj,
        };
      }

      // 基本类型
      return {
        type: typeof obj,
        value: obj,
      };
    },
    // 将颜色转换成16进制
    Color(color) {
      return {
        type: "Color",
        value: color.toCSS()
      };
    },
    // 树节点构造：只需要node中的其中一些属性
    TreeNode(node) {
      if (node instanceof cc.Node) {
        // 添加新节点
        ccIns.addObjectToStorage(node.uuid, "node", node);

        let rtnNode = {
          uuid: node.uuid,
          name: node.name,
          components: [], // 用来查找
          children: [],
        };
        if (!(node instanceof cc.Scene)) {
          rtnNode.activeInHierarchy = node.activeInHierarchy; // 用来添加删除线
        }

        // 组件信息
        node._components.forEach(com => {
          // 添加新组件
          ccIns.addObjectToStorage(com.uuid, "node", com);

          rtnNode.components.push(com.__classname__);
          // 添加该脚本的枚举属性
          if (ccIns.Enum.add(com)) {
            // 发送该枚举属性
            ccIns.sendMsgToDevTools(ccIns.Connect.msgType.enumType, {
              key: com.__classname__.substr(3),
              value: ccIns.Enum.get(com)
            });
          }
        });

        return rtnNode;
      }
    },
    // 为了防止递归，不放置components
    Node(obj) {
      return ccIns.Connect.CCType(obj, key => {
        return ["components", "children"].indexOf(key) == -1;
      });
    },
    // Scene中不存在active
    Scene(obj) {
      return ccIns.Connect.CCType(obj, key => {
        return ["components", "children", "active", "activeInHierarchy"].indexOf(key) == -1;
      });
    },

    // 组件构造：构造自定义组件。
    CustomComponent(com) {
      if (com instanceof cc.Component) {
        // 构造自定义脚本类型
        let filterCom = {
          uuid: com.uuid,
          enabled: com.enabled,
          enabledInHierarchy: com.enabledInHierarchy,
        };
        // 过滤掉私有值和函数的值
        for (let key of Object.keys(com)) {
          let value = com[key];
          if (ccIns.isPublicVar(com, key) && !(value instanceof Array)) {
            // object节点无法通过post进行复制，因此在此处修改
            if (value instanceof cc.Object || value instanceof cc.Action) {
              filterCom[key] = {
                name: value.name,
                uuid: value.uuid,
              };
            } else {
              filterCom[key] = value;
            }
          }
        }
        return {
          type: com.__classname__,
          value: filterCom,
        };
      }
    },
  };
}