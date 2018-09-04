// Author: huzi(moustache)
// Date: 18-7-27 11:24
// Description: 注入脚本并且真正运行的代码
export default function () {
  // 检测是否包含cc变量
  // 如果存在cc空间，游戏存在
  if (cc) {
    if (!ccIns.isNotFirst) {
      ccIns.isNotFirst = true;
      // 初始化debug模式
      ccIns.initDebugGraphicsNode();

      // 添加节点刷新帧
      cc.director.on(cc.Director.EVENT_AFTER_DRAW, function () {
        let interval = ccIns.Config.nodeRefleshInterval;
        let timer = 0.0;
        return function (event) {
          timer += cc.director._deltaTime;
          // if-1: game暂停时点击step，会更改节点属性
          // if-2: director没有暂停，则正常计时
          // if-3: 当director暂停时，仍然会进入，此时计时停止（director暂停，此时能渲染界面）
          if (cc.game.isPaused() || (!cc.director.isPaused() && timer > interval)) {
            ccIns.sendMsgToDevTools(ccIns.Connect.msgType.refleshInfo, {});
            timer = 0.0;
          }
        };
      }(), cc.director);

      // 添加节点树刷新帧
      cc.director.on(cc.Director.EVENT_AFTER_DRAW, function () {
        let interval = ccIns.Config.nodeTreeRefleshInterval;
        let timer = 0.0;
        return function (event) {
          timer += cc.director._deltaTime;
          if (timer > interval) {
            ccIns.sendNodeTreeInfo();
            timer = 0.0;
          }
        };
      }(), cc.director);

      // 检测cc.Graphics是否存在
      if (cc.Graphics) {
        // 添加Graphics刷新帧
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, function () {
          let interval = ccIns.Config.graphicsRefleshInterval;
          let timer = 0.0;
          return function (event) {
            timer += cc.director._deltaTime;
            if (timer > interval) {
              if (ccIns.updateGraphicsTree) {
                ccIns.updateGraphicsTree(ccIns.QuadNode.root, cc.director._scene);
                ccIns.drawNode(ccIns.graphicsNode.getComponent("cc.Graphics"));
              }
              timer = 0.0;
            }
          };
        }(), cc.director);

        // 添加新场景刷新时的触发器
        //  场景重启时，重新挂载drawnode节点，并恢复DEBUG模式
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
          let active = ccIns.graphicsNode.active;
          ccIns.initDebugGraphicsNode();
          ccIns.graphicsNode.active = active;
        }, cc.director);
      } else {
        ccIns.sendMsgToDevTools(ccIns.Connect.msgType.notSupport, "不支持Debug模式!");
        console.log("can't use Debug model");
      }
    }

    ccIns.sendNodeTreeInfo();
    return true;
  } else {
    ccIns.sendMsgToDevTools(ccIns.Connect.msgType.notSupport, "不支持调试游戏!");
    console.log("not find cocos creator game");
    return false;
  }
}