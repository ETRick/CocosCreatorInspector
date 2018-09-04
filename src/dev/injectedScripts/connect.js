// Author: huzi(moustache)
// Date: 18-7-27 11:19
// Description: 此文件包含ccIns.Connect，用于通讯。
export default function () {
  if (typeof ccIns == "undefined") {
    ccIns = {};
  }

  // 用于通讯结构构造
  ccIns.Connect = ccIns.Connect || {
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
    // 树节点构造：只需要node中的其中一些属性，用于树的显示
    //   函数在节点构造的同时，会储存节点到ccIns.gameStorageMemory中
    //   函数在节点构造的同时，会发送枚举属性
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
            ccIns.sendMsgToDevTools(this.msgType.enumType, {
              key: com.__classname__.substr(3),
              value: ccIns.Enum.get(com)
            });
          }
        });

        return rtnNode;
      }
    },
    // 自定义类型构造，通用类型构造，所有类型访问的入口
    //   PS：为了防止递归，设置flag数组isEnterArr
    CustomType(obj, isEnterArr) {
      isEnterArr = isEnterArr || [];
      if (typeof obj == "object") {
        // 如果已经访问过，直接返回NULL
        if (isEnterArr.hasValue(obj)) {
          return this.NULL();
        } else {
          isEnterArr.push(obj);
        }
      }
      
      // 空属性值
      // undefined 不存在这个属性
      if (obj === undefined) {
        return undefined;
      }
      // 存在这个属性但是为null
      if (obj === null) {
        return this.NULL();
      }

      // cc内部结构或脚本
      if (ccIns.isCCType(obj)) {
        let type = obj.__classname__.substr(3);
        let value = {};
        if (this[type]) {
          // 如果是自己适配过的cc类型，使用自己的构造函数
          value = this[type](obj, isEnterArr);
        } else if (cc[type]) {
          // 如果是在cc中已经定义的类型，使用已定义的构造函数
          value = this.definedCCType(obj, isEnterArr);
        } else {
          // 如果两者都不是，只查找需要显示的name
          value.name = this.CustomType(obj.name, isEnterArr);
        }
        return {
          type: type,
          value: value,
        };
      }

      // cc未定义的结构和脚本（例如自定义脚本）
      if (obj.__classname__) {
        return this.undefinedCCType(obj, isEnterArr);
      }

      // 数组
      if (obj instanceof Array) {
        return this.ArrayType(obj, isEnterArr);
      }

      // 基本类型
      return this.BaseType(obj);
    },
    // cc中已经定义的类型
    definedCCType(obj, isEnterArr) {
      let rtnObj = {};
      let objType = obj.__classname__.substr(3);
      // 通过__props__获得key值
      for (let key of cc[objType].__props__) {
        // 忽略私有变量和函数
        if (ccIns.isPublicVar(obj, key)) {
          rtnObj[key] = this.CustomType(obj[key], isEnterArr);
        }
      }
      return rtnObj;
    },
    // cc中没有定义的类型
    undefinedCCType(com, isEnterArr) {
      if (com instanceof cc.Component) {
        // 构造自定义脚本类型
        let filterCom = {
          uuid: this.BaseType(com.uuid),
          enabled: this.BaseType(com.enabled),
          enabledInHierarchy: this.BaseType(com.enabledInHierarchy),
        };

        // 过滤掉私有值和函数的值
        for (let key of Object.keys(com)) {
          let value = com[key];
          if (ccIns.isPublicVar(com, key)) {
            filterCom[key] = this.CustomType(value, isEnterArr);
          }
        }

        return {
          type: com.__classname__,
          value: filterCom,
        };
      }
    },
    // 颜色构造函数
    Color(color) {
      return color.toCSS();
    },
    // 为了防止递归，不放置components
    Node(obj, isEnterArr) {
      let rtnObj = {};
      let objType = obj.__classname__.substr(3);
      // 通过__props__获得key值
      for (let key of cc[objType].__props__) {
        // 忽略components, children
        if (!["components", "children"].hasValue(key) && ccIns.isPublicVar(obj, key)) {
          rtnObj[key] = this.CustomType(obj[key], isEnterArr);
        }
      }
      return rtnObj;
    },
    // Scene和Node类似，但是Scene中不存在active
    Scene(obj, isEnterArr) {
      let rtnObj = {};
      let objType = obj.__classname__.substr(3);
      // 通过__props__获得key值
      for (let key of cc[objType].__props__) {
        // 忽略components, children
        if (!["components", "children", "active", "activeInHierarchy"].hasValue(key) && ccIns.isPublicVar(obj, key)) {
          rtnObj[key] = this.CustomType(obj[key], isEnterArr);
        }
      }
      return rtnObj;
    },
    // 数组类型
    ArrayType(obj, isEnterArr) {
      // 数组类型
      let rtnObj = [];
      for (let item of obj) {
        rtnObj.push(this.CustomType(item, isEnterArr));
      }
      return {
        type: "Array",
        value: rtnObj,
      };
    },
    // 基本类型构造：
    //   基本类型是指js的基本类型(number, string之类)
    BaseType(obj) {
      return {
        type: typeof obj,
        value: obj,
      };
    },
    NULL() {
      return {
        type: "null",
        value: null,
      };
    }
  };
}