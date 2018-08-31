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
    // 树节点构造：只需要node中的其中一些属性，在节点构造时储存节点到ccIns.gameStorageMemory中
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
      // 空属性值
      // undefined 不存在这个属性
      if (obj === undefined) {
        return undefined;
      }
      // 存在这个属性但是为null
      if (obj === null) {
        return {
          type: "null",
          value: null,
        };
      }

      // cc内部结构或脚本
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

      // 数组
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
      return this.BaseType(obj);
    },
    // 将颜色转换成16进制
    Color(color) {
      return color.toCSS();
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
          uuid: {
            type: "string",
            value: com.uuid,
          },
          enabled: {
            type: "boolean",
            value: com.enabled,
          },
          enabledInHierarchy: {
            type: "boolean",
            value: com.enabledInHierarchy,
          },
        };
        
        // 过滤掉私有值和函数的值
        for (let key of Object.keys(com)) {
          let value = com[key];
          if (ccIns.isPublicVar(com, key) && !(value instanceof Array)) {
            // object节点无法通过post进行复制，因此在此处修改
            filterCom[key] = this.CustomType(value);
          }
        }
        return {
          type: com.__classname__,
          value: filterCom,
        };
      }
    },
    // 基本类型构造：
    //   由于typeof不能直接使用，因此采用switch的方式
    BaseType(obj) {
      let type;
      if (typeof obj == "number") {
        type = "number";
      } else if (typeof obj == "string") {
        type = "string";
      } else if (typeof obj == "boolean") {
        type = "boolean";
      } else if (typeof obj == "object") {
        type = "object";
      } else {
        console.log("Error:", type);
      }
      return {
        type: type,
        value: obj,
      };
    }
  };
}