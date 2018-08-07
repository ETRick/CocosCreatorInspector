// Author: huzi(moustache)
// Date: 18-7-27 11:24
// Description: eval注入脚本的代码,变量尽量使用var,后来发现在import之后,let会自动变为var
export default function () {
  // 检测是否包含cc变量
  let isCocosCreatorGame = true;
  try {
    let cocosInspectorTestVar = cc;
  } catch (e) {
    isCocosCreatorGame = false;
    window.sendMsgToDevTools(window.Connect.msgType.notSupport, "不支持调试游戏!");
  }

  // 存在cc空间，游戏存在
  if (isCocosCreatorGame) {
    if (!window.isNotFirst) {
      window.isNotFirst = true;
      // 添加节点刷新帧
      cc.director.on(cc.Director.EVENT_AFTER_DRAW, function () {
        let interval = 0.2;
        let timer = 0.0;
        return function (event) {
          timer += cc.director._deltaTime;
          // if-1: game暂停时点击step，会更改节点属性
          // if-2: director没有暂停，则正常计时
          // if-3: 当director暂停时，仍然会进入，此时计时停止（director暂停，此时能渲染界面）
          if (cc.game.isPaused() || (!cc.director.isPaused() && timer > interval)) {
            window.sendMsgToDevTools(window.Connect.msgType.refleshInfo, {});
            timer = 0.0;
          }
        };
      }(), cc.director);

      // 添加节点树刷新帧
      cc.director.on(cc.Director.EVENT_AFTER_DRAW, function () {
        let interval = 0.2;
        let timer = 0.0;
        return function (event) {
          timer += cc.director._deltaTime;
          if (timer > interval) {
            window.sendNodeTreeInfo();
            timer = 0.0;
          }
        };
      }(), cc.director);

      // 添加DOM刷新帧
      cc.director.on(cc.Director.EVENT_AFTER_DRAW, function () {
        let interval = 0.0;
        let timer = 0.0;
        return function (event) {
          timer += cc.director._deltaTime;
          if (timer > interval) {
            if (window.rightClickQuad) {
              let quadnode = window.rightClickQuad;
              let ccnode = window.inspectorGameMemoryStorage[quadnode.uuid]
              window.updateGraphicsTree(quadnode, ccnode);
              timer = 0.0;
            } else {
              cc.Canvas.instance.node.parent.getChildByName("Debug-Graphics").getComponent("cc.Graphics").clear();
            }
          }
        };
      }(), cc.director);
    }

    window.sendNodeTreeInfo();
  } else {
    console.log("未发现cocos creator game");
  }
}