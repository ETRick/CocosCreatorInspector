// Author: huzi(moustache)
// Date: 18-8-3 9:42
// Description: util函数类，包含各种挂载到其他物体上的函数（不作为接口）
export default function () {
    // 由于存在'/'等不明字符，因此转换成ascii码
    let hashUuid = function (uuid) {
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

    /* Math操作 */
    Math.angle2Radian = function (a) {
        return Math.PI / 180 * a;
    };
    Math.radian2Angle = function (r) {
        return 180 / Math.PI * r;
    };

    /* DOM操作 */
    // 创造DOM元素，实际上是div
    jQuery.createDOMElement = function (uuid) {
        let config = window.Config.DEBUG_MODE;
        return $('<div></div>')
            // 添加id
            .attr({
                'id': 'DEBUG-' + hashUuid(uuid),
                'uuid': uuid,
            })
            // 添加border
            .css({
                'border-style': 'solid',
                'border-color': config.showCustomBorder ? config.customBorderColor : '#00000000',
                'border-width': config.lineWidth + 'px',
                'position': 'absolute',
            })
            // 添加hover
            .hover(
                function (e) {
                    window.changeDOMBorder($(this));
                    // 这里会循环调用
                    e.stopPropagation();
                })
            // 添加click
            .click(
                function (e) {
                    window.sendMsgToDevTools(window.Connect.msgType.clickedNodeInfo, $(this).attr("uuid"));
                    e.stopPropagation();
                });
    };

    // 通过uuid寻找DOM元素
    jQuery.getDOMElement = function (uuid) {
        return $('#DEBUG-' + hashUuid(uuid));
    };

    // 设置id和uuid
    jQuery.prototype.setIdAndUuid = function (uuid) {
        return $(this).attr({
            'id': 'DEBUG-' + hashUuid(uuid),
            'uuid': uuid,
        });
    };

    // 设置top,left,width,height
    jQuery.prototype.setPositionAndSize = function (top, left, width, height) {
        let config = window.Config.DEBUG_MODE;
        return $(this).css({
            // 由于chrome问题，需要加上边界长度
            'top': (top ? top : 0) - config.lineWidth + 'px',
            'left': (left ? left : 0) - config.lineWidth + 'px',
            'width': width ? width : 0 + 'px',
            'height': height ? height : 0 + 'px',
        });
    };

    // 设置Anchor（CSS3），只设置chrome
    jQuery.prototype.setAnchor = function (anchorX, anchorY) {
        return $(this).css(
            "-webkit-transform-origin",
            anchorX * 100 + "% " + anchorY * 100 + "%"
        );
    };

    // 设置rotate和skew（CSS3），由于属性只能用matrix定义，因此需要同时设置，只设置chrome
    /* 使用2D转换六值矩阵：
     *  a c e   x   ax + cy + e
     *  b d f · y = bx + dy + f
     *  0 0 1   1   0  + 0  + 1
     * 旋转：matrix(cosθ, sinθ, -sinθ, cosθ, 0, 0)  ===  rotate(θ + "deg")
     * 斜切：matrix(1, tan(skewY), tan(skewX), 1, 0, 0)  === skew(skewX + "deg", skewY + "deg")
     */
    jQuery.prototype.setSkewAndRotate = function (matrix) {
        return $(this).css(
            "-webkit-transform",
            "matrix(" + matrix.a + "," + matrix.b + "," +
                matrix.c + "," + matrix.d + "," +
                0 + "," + 0 + ")" 
        );
    };

    /* cc.Node操作 */

    /*
     * 用于进行位置转换的函数，其中x/y代表CC坐标系，left/top代表DOM坐标系（y=-top）
     * CC position format: {x, y}
     * DOM position format: {left, top}
     * PS: 位置和父节点的scale有关系
     *
     * 两者坐标转换原则：
     *  x / ccCanvas.width = left / domCanvas.width()
     *  y / ccCanvas.height = -top / domCanvas.height()
     * 
     * 要注意的点：
     *  1. 父节点进行缩放的同时，会影响子节点的位置和长度
     *  2. 注意width可能为负数
     */

    // 得到至父节点为止的scale参数
    cc.Node.prototype.getAbsoluteScale = function() {
        let parent = this.parent;
        let scale = {
            x: 1,
            y: 1,
        };
        while (parent) {
            scale.x *= parent.scaleX;
            scale.y *= parent.scaleY;
            parent = parent.parent;
        }
        return scale;
    }

    // 得到子锚点和父锚点的相对位置：C_anchor - P_anchor
    cc.Node.prototype.getRelativeAnchorPosition = function () {
        let scale = this.getAbsoluteScale();
        return {
            x: (this.x * scale.x),
            y: (this.y * scale.y),
        };
    };

    // 得到物体左上角距离自己锚点的相对位置：C_lefttop - C_anchor
    cc.Node.prototype.getSelfLeftTopPosition = function () {
        let scale = this.getAbsoluteScale();
        return {
            x: (-this.width * this.anchorX + (this.width < 0) * this.width) * this.scaleX * scale.x,
            y: (this.height * (1 - this.anchorY) - (this.height < 0) * this.height) * this.scaleY * scale.y,
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
        let scale = this.getAbsoluteScale();
        return {
            width: Math.abs(this.width * scale.x) * this.scaleX * domCanvas.width() / ccCanvas.width,
            height: Math.abs(this.height * scale.y) * this.scaleY * domCanvas.height() / ccCanvas.height,
        };
    };

    // 局部CC节点转换成DOM节点：
    cc.Node.convertRelativeCC2DOM = function (ccpos) {
        return {
            left: ccpos.x * domCanvas.width() / ccCanvas.width,
            top: -ccpos.y * domCanvas.height() / ccCanvas.height,
        };
    };

    // 局部DOM节点转换成CC节点
    cc.Node.convertRelativeDOM2CC = function (dompos) {
        return {
            x: dompos.left * ccCanvas.width / domCanvas.width(),
            y: -dompos.top * ccCanvas.height / domCanvas.height(),
        };
    };
}