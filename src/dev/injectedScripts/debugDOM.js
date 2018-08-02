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
        if (!window.Config) {
            window.Config = {};
        }
        window.Config.DEBUG_MODE = {
            lineWidth: 2,
            clickedBroderColor: "red",
            showCustomBorder: true,
            customBorderColor: "blue",
        };

        // 创造DOM元素，实际上是div
        jQuery.createDOMElement = function (uuid) {
            let config = window.Config.DEBUG_MODE;
            return $('<div></div>')
                // 添加id
                .attr({
                    'id': 'DEBUG-' + formatUuid(uuid),
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
            return $('#DEBUG-' + formatUuid(uuid));
        };

        // 设置id和uuid
        jQuery.prototype.setIdAndUuid = function (uuid) {
            return $(this).attr({
                'id': 'DEBUG-' + formatUuid(uuid),
                'uuid': uuid,
            });
        };

        // 设置top,left,width,height
        jQuery.prototype.setPositionAndSize = function (top, left, width, height) {
            let config = window.Config.DEBUG_MODE;
            return $(this).css({
                // 由于chrome问题，
                'top': (top ? top : 0) - config.lineWidth + 'px',
                'left': (left ? left : 0) - config.lineWidth + 'px',
                'width': width ? width : 0 + 'px',
                'height': height ? height : 0 + 'px',
            });
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
        let convertRelativeDOM2CC = function (dompos) {
            return {
                x: dompos.left * ccCanvas.width / domCanvas.width(),
                y: -dompos.top * ccCanvas.height / domCanvas.height(),
            };
        };

        // 通过uuid生成DOM根节点
        if ($.getDOMElement(ccCanvas.uuid).length == 0) {
            let divCanvas = $.createDOMElement(ccCanvas.uuid)
                .setPositionAndSize(domCanvas.position().top, domCanvas.position().left)
            domCanvas.before(divCanvas);
            window.hiddenDOM();
        }

        // 更新DOM树
        window.updateDOMTree = (cccanvas => {
            // 使用不动点进行内部递归
            let fix = (f) => f(f);
            // domtree: children(), cctree: children
            (fix(fact => (domtree, cctree) => {
                let domchildren = domtree.children();
                let ccchildren = cctree.children;
                for (let i = 0; i < ccchildren.length; i++) {
                    let domnode = $(domchildren[i]);
                    let ccnode = cctree.children[i];

                    // 获得必要参数
                    let tl = convertRelativeCC2DOM(ccnode.getRelativeLeftTopPosition());
                    let size = ccnode.getDOMSize();
                    if (domnode.length == 0) {
                        // add 
                        let domElement = $.createDOMElement(ccnode.uuid)
                            .setPositionAndSize(tl.top, tl.left, size.width, size.height)
                            .css("display", ccnode.active ? "inherit" : "none");
                        domtree.append(domElement);
                    } else {
                        // update
                        domnode.setIdAndUuid(ccnode.uuid)
                            .setPositionAndSize(tl.top, tl.left, size.width, size.height)
                            .css("display", ccnode.active ? "inherit" : "none");
                        fact(fact)(domnode, ccnode);
                    }
                }
                // remove(jq.remove()删除后不改变本数组)
                for (let i = ccchildren.length; i < domchildren.length; i++) {
                    $(domchildren[i]).remove();
                }
            }))($.getDOMElement(cccanvas.uuid), cccanvas);
        });

        window.updateDOMTree(ccCanvas);
    }
}