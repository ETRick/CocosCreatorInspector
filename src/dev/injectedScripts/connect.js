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
      if (node instanceof cc.Node || node instanceof cc.Scene) {
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
        if (node._components) {
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
        }

        return rtnNode;
      }
    },
    // 自定义类型构造，通用类型构造，所有类型访问的入口
    //   PS：为了防止递归，设置flag数组isEnterArr
    CustomType(obj, isEnterArr) {
      isEnterArr = isEnterArr || [];

      // 对对象进行访问判断
      if (typeof obj == "object") {
        // 如果已经访问过，直接返回NULL
        if (isEnterArr.hasValue(obj)) {
          return this.NULLType();
        } else {
          isEnterArr.push(obj);
        }
      }

      // 返回的object
      let rtnObj;

      if (obj === undefined) {
        // undefined 不存在这个属性
        rtnObj = undefined;
      } else if (obj === null) {
        // 存在这个属性但是为null
        rtnObj = this.NULLType();
      } else if (obj instanceof Array) {
        // 数组
        rtnObj = this.ArrayType(obj, isEnterArr);
      } else if (ccIns.isCCType(obj)) {
        // cc内部结构或脚本
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
        rtnObj = {
          type: type,
          value: value,
        };
      } else if (obj.__classname__ || typeof obj == "object") {
        // cc未定义的结构和脚本（例如自定义脚本）
        rtnObj = this.undefinedCCType(obj, isEnterArr);
      } else {
        // 基本类型
        rtnObj = this.BaseType(obj);
      }

      // 访问过后，对象弹出
      if (typeof obj == "object") {
        isEnterArr.pop(obj);
      }

      return rtnObj;
    },
    // cc中已经定义的类型
    definedCCType(obj, isEnterArr) {
      let rtnObj = {};
      let objType = obj.__classname__.substr(3);

      // 脚本有额外属性
      if (obj instanceof cc.Component) {
        // 构造自定义脚本类型
        rtnObj.uuid = this.BaseType(obj.uuid);
        rtnObj.enabled = this.BaseType(obj.enabled);
        rtnObj.enabledInHierarchy = this.BaseType(obj.enabledInHierarchy);
      }

      // 通过__props__获得key值
      for (let key of cc[objType].__props__) {
        key = ccIns.pri2Pub(key);
        // 忽略私有变量和函数
        if (ccIns.isPublicVar(obj, key)) {
          rtnObj[key] = this.CustomType(obj[key], isEnterArr);
        }
      }
      return rtnObj;
    },
    // cc中没有定义的类型
    undefinedCCType(obj, isEnterArr) {
      let rtnObj = {};

      // 脚本有额外属性
      if (obj instanceof cc.Component) {
        // 构造自定义脚本类型
        rtnObj.uuid = this.BaseType(obj.uuid);
        rtnObj.enabled = this.BaseType(obj.enabled);
        rtnObj.enabledInHierarchy = this.BaseType(obj.enabledInHierarchy);
      }

      // 过滤掉私有值和函数的值
      for (let key of Object.keys(obj)) {
        key = ccIns.pri2Pub(key);
        let value = obj[key];
        if (ccIns.isPublicVar(obj, key)) {
          rtnObj[key] = rtnObj[key] || this.CustomType(value, isEnterArr);
        }
      }

      return {
        type: obj.__classname__ ? obj.__classname__ : "object",
        value: rtnObj,
      };
    },
    // 颜色构造函数
    Color(color) {
      return color.toCSS();
    },
    // 为了防止递归，不放置components
    Node(obj, isEnterArr) {
      let rtnObj = {
        uuid: this.BaseType(obj.uuid),
        name: this.BaseType(obj.name),
        width: this.BaseType(obj.width),
        height: this.BaseType(obj.height),
        color: this.CustomType(obj.color),
        opacity: this.BaseType(obj.opacity),
        rotation: this.BaseType(obj.rotation),
        anchorX: this.BaseType(obj.anchorX),
        anchorY: this.BaseType(obj.anchorY),
        active: this.BaseType(obj.active),
        activeInHierarchy: this.BaseType(obj.activeInHierarchy),
        zIndex: this.BaseType(obj.zIndex),
      };
      let objType = obj.__classname__.substr(3);
      // 通过__props__获得key值
      for (let key of cc[objType].__props__) {
        key = ccIns.pri2Pub(key);
        // 忽略components, children
        if (!["components", "children"].hasValue(key) && ccIns.isPublicVar(obj, key)) {
          // 私有变量转公有变量
          rtnObj[key] = rtnObj[key] || this.CustomType(obj[key], isEnterArr);
        }
      }
      return rtnObj;
    },
    // Scene和Node类似，但是Scene中不存在active
    Scene(obj, isEnterArr) {
      let rtnObj = {
        uuid: this.BaseType(obj.uuid),
        zIndex: this.BaseType(obj.zIndex),
        width: this.BaseType(obj.wedth),
        height: this.BaseType(obj.height),
        color: this.CustomType(obj.color),
        opacity: this.BaseType(obj.opacity),
        rotation: this.BaseType(obj.rotation),
        anchorX: this.BaseType(obj.anchorX),
        anchorY: this.BaseType(obj.anchorY),
      };
      let objType = obj.__classname__.substr(3);
      // 通过__props__获得key值
      for (let key of cc[objType].__props__) {
        key = ccIns.pri2Pub(key);
        // 忽略components, children
        if (!["components", "children", "active", "activeInHierarchy"].hasValue(key) && ccIns.isPublicVar(obj, key)) {
          rtnObj[key] = rtnObj[key] || this.CustomType(obj[key], isEnterArr);
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
      if (typeof obj != "undefined") {
        return {
          type: typeof obj,
          value: obj,
        };
      }
    },
    NULLType() {
      return {
        type: "null",
        value: null,
      };
    }
  };
}