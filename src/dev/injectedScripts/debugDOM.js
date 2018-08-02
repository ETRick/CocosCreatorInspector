// Author: huzi(moustache)
// Date: 18-8-1 10:58
// Description: 向页面生成DOM节点树，和cc节点树单向绑定，显示cc节点的边框
export default function () {
  // 页面中需要存在cc（js）和canvas（DOM）
  if (typeof cc != 'undefined' && $('canvas').length != 0) {
    let domCanvas = $('canvas');
    let ccCanvas = cc.Canvas.instance.node;

    /* ------------------- util function ----------------------- */

    // 由于存在'/'等不明字符，因此转换成ascii码
    let formatUuid = function (uuid) {
      const isNumber = function (ch) {
        return ch >= '0' && ch <= '9';
      };
      const isLetter = function (ch) {
        return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
      };
      for (let i = uuid.length - 1; i >= 0; i--) {
        if (!isNumber(uuid[i]) && !isLetter(uuid[i])) {
          uuid = uuid.substring(0, i) + uuid[i].charCodeAt() +
            uuid.substring(i + 1);
        }
      }
      return uuid;
    };

    /* DOM操作 */
    // 创造DOM元素，实际上是div
    let createDOMElement = function (uuid, top, left, width, height) {
      let lineWidth = 1;
      let dom = $('<div></div>')
        .attr({
          'id': 'DEBUG-' + formatUuid(uuid),
          'uuid': uuid,
        })
        .css({
          'top': top ? top - lineWidth : 0 + 'px',
          'left': left ? left - lineWidth : 0 + 'px',
          'width': width ? width : 0 + 'px',
          'height': height ? height : 0 + 'px',
        })
        .css({
            'border-style': 'solid',
            // 初始设置为透明
            'border-color': '#00000000',
            'border-width': lineWidth + 'px',
            'position': 'absolute',
        });
      // 当width，height不为0，添加click
      if (width && height) {
        dom.click(
          function (e) {
            window.changeDOMBorder($(this));
            // 这里会循环调用
            window.sendMsgToDevTools(window.Connect.msgType.clickedNodeInfo, $(this).attr("uuid"));
            e.stopPropagation();
          });
      }
      return dom;
    };

    // 通过uuid寻找DOM元素
    let getDOMElement = function (uuid) {
      return $('#DEBUG-' + formatUuid(uuid));
    };

    /* cc.Node操作 */

    /*
     * 用于进行位置转换的函数，其中x/y代表CC坐标系，left/top代表DOM坐标系（y=-top）
     * CC position format: {x, y}
     * DOM position format: {left, top}
     *
     * 两者坐标转换原则：
     *  x / ccCanvas.width = left / domCanvas.width()
     *  y / ccCanvas.height = -top / domCanvas.height()
     */

    // 得到子锚点和父锚点的相对位置：C_anchor - P_anchor
    cc.Node.prototype.getRelativeAnchorPosition = function () {
      return {
        x: this.x,
        y: this.y,
      };
    };

    // 得到物体左上角距离自己锚点的相对位置：C_lefttop - C_anchor
    cc.Node.prototype.getSelfLeftTopPosition = function () {
      return {
        x: -this.width * this.scaleX * this.anchorX,
        y: this.height * this.scaleY * (1 - this.anchorY),
      };
    };

    // 得到物体左上角距离父节点左上角的相对位置：
    //  C_lefttop - P_lefttop = (C_lefttop - C_anchor)
    //                        + (C_anchor - P_anchor)
    //                        - (P_lefttop - P_anchor)
    cc.Node.prototype.getRelativeLeftTopPosition = function () {
      if (this.parent) {
        return {
          x: this.getSelfLeftTopPosition().x +
            this.getRelativeAnchorPosition().x -
            this.parent.getSelfLeftTopPosition().x,
          y: this.getSelfLeftTopPosition().y +
            this.getRelativeAnchorPosition().y -
            this.parent.getSelfLeftTopPosition().y,
        };
      }
    };

    // 得到DOM上物体的width/height（此时不用取反）
    cc.Node.prototype.getDOMSize = function () {
      return {
        width: this.width * this.scaleX * domCanvas.width() / ccCanvas.width,
        height: this.height * this.scaleY * domCanvas.height() / ccCanvas.height,
      };
    };

    // 局部CC节点转换成DOM节点：
    let convertRelativeCC2DOM = function (ccpos) {
      return {
        left: ccpos.x * domCanvas.width() / ccCanvas.width,
        top: -ccpos.y * domCanvas.height() / ccCanvas.height,
      };
    };

    // 局部DOM节点转换成CC节点
    let convertRelativeDOM2CC =
      function (dompos) {
        return {
          x: dompos.left * ccCanvas.width / domCanvas.width(),
          y: -dompos.top * ccCanvas.height / domCanvas.height(),
        };
      }

    // 通过uuid生成DOM根节点
    if (getDOMElement(ccCanvas.uuid).length == 0) {
      let divCanvas = createDOMElement(
        ccCanvas.uuid, domCanvas.position().top, domCanvas.position().left);
      domCanvas.before(divCanvas);
    }

    // 通过uuid遍历cc节点生成DOM树
    // 不动点
    // const fix = (f) => f(f);
    // // 通过不动点执行匿名函数，生成DOM树
    // fix(fact => node => {
    //     let domnode = getDOMElement(node.uuid);
    //     for (let i = 0; i < node.children.length; i++) {
    //         let child = node.children[i];
    //         if (getDOMElement(child.uuid).length == 0) {
    //             let tl =
    //             convertRelativeCC2DOM(child.getRelativeLeftTopPosition());
    //             let size = child.getDOMSize();
    //             let domElement = createDOMElement(child.uuid, tl.top,
    //             tl.left, size.width, size.height); domnode.append(domElement)
    //         };
    //         fact(fact)(child);
    //     }
    // })(ccCanvas);

    window.updateDOMTree = (node => {
      let domnode = getDOMElement(node.uuid);
      for (let i = 0; i < node.children.length; i++) {
        let child = node.children[i];
        // console.log(child);
        if (getDOMElement(child.uuid).length == 0) {
          let tl = convertRelativeCC2DOM(child.getRelativeLeftTopPosition());
          let size = child.getDOMSize();
          let domElement = createDOMElement(
            child.uuid, tl.top, tl.left, size.width, size.height);
          domnode.append(domElement);
        };
        window.updateDOMTree(child);
      }
    });
    window.updateDOMTree(ccCanvas);
  }
}