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
    // 添加节点刷新帧
    if (!hasListen) {
      var hasListen = cc.director.on(cc.Director.EVENT_AFTER_DRAW, function () {
        let interval = 0.2;
        let timer = 0.0;
        return function (event) {
          timer += cc.director._deltaTime;
          // 暂停时可能会调用step，此时进入
          if (cc.game.isPaused() || timer > interval) {
            // console.log(timer);
            window.sendMsgToDevTools(window.Connect.msgType.refleshInfo, {});
            window.sendNodeTreeInfo();
            timer = 0.0;
          }
        };
      }(), cc.director);
    }

    window.sendNodeTreeInfo();
  } else {
    console.log("未发现cocos creator game");
  }
}