// Author: huzi(moustache)
// Date: 18-7-27 11:24
// Description: eval注入脚本的代码,变量尽量使用var,后来发现在import之后,let会自动变为var
export default function () {
  // 检测是否包含cc变量
  // 如果存在cc空间，游戏存在
  if (cc) {
    if (!ccIns.isNotFirst) {
      ccIns.isNotFirst = true;
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
                ccIns.updateGraphicsTree(ccIns.QuadNode.root, cc.Canvas.instance.node);
                ccIns.drawNode();
              }
              timer = 0.0;
            }
          };
        }(), cc.director);
      } else {
        ccIns.sendMsgToDevTools(ccIns.Connect.msgType.notSupport, "不支持Debug模式!");
        console.log("can't use Debug model");
      }
    }

    ccIns.sendNodeTreeInfo();
  } else {
    ccIns.sendMsgToDevTools(ccIns.Connect.msgType.notSupport, "不支持调试游戏!");
    console.log("not find cocos creator game");
  }
}