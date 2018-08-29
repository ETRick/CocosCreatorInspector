// Author: huzi(moustache)
// Date: 18-8-1 10:58
// Description: 向页面生成DOM节点树，和cc节点树单向绑定，显示cc节点的边框
export default function () {
    ccIns.initDebugGraphics = function () {
        let ccCanvas = cc.Canvas.instance.node;
        // 页面中需要存在cc（js），cc.Graphics，并且没有生成Graphics节点
        if (cc && cc.Graphics && !ccCanvas.parent.getChildByName("Debug-Graphics")) {
            ccIns.QuadNode.root = new ccIns.QuadNode(ccCanvas);

            // 生成Graphics挂载节点和Graphics脚本
            let node = new cc.Node();
            node.name = "Debug-Graphics";
            node.addComponent("cc.Graphics");
            ccCanvas.parent.addChild(node);
            ccIns.graphicsNode = node;
            let config = ccIns.Config.DEBUG_MODE;
            node.getComponent("cc.Graphics").lineWidth = config.lineWidth;

            // 设置节点属性
            node.active = false; // 一开始隐藏
            node.anchorX = 0;
            node.anchorY = 0;
            node.width = ccCanvas.width;
            node.height = ccCanvas.height;

            // 绑定hover
            node.on(cc.Node.EventType.MOUSE_MOVE, function (e) {
                // 得到当前鼠标位置的四边形
                let node = e.target;
                if (node.active) {
                    let pos = e.getLocation();
                    let quadnodes = getQuadsContainPos(pos);
                    let quadnode = getNearestQuad(quadnodes, pos);
                    if (ccIns.QuadNode.hover != quadnode) {
                        ccIns.QuadNode.hover = quadnode;
                    }
                }
            }, node);

            // 绑定click
            node.on(cc.Node.EventType.MOUSE_DOWN, function (e) {
                if (ccIns.QuadNode.clicked != ccIns.QuadNode.hover) {
                    ccIns.QuadNode.clicked = ccIns.QuadNode.hover;
                }
                // 同步到节点树
                if (ccIns.QuadNode.clicked) {
                    ccIns.sendMsgToDevTools(ccIns.Connect.msgType.clickedNodeInfo, ccIns.QuadNode.clicked.uuid);
                }
            }, node);

            // 得到包含点的所有Quads
            function getQuadsContainPos(pos) {
                let arr = [];
                // 使用不动点进行内部递归
                let fix = (f) => f(f);
                (fix(fact => (quadtree, arr) => {
                    let quadchildren = quadtree.children;
                    for (let i = quadchildren.length - 1; i >= 0; i--) {
                        let quadnode = quadchildren[i];
                        // 判断是否包含
                        if (quadnode.active && quadnode.quad.containPoint(pos)) {
                            arr.push(quadnode);
                        }
                        fact(fact)(quadnode, arr);
                    }
                }))(ccIns.QuadNode.root, arr);
                return arr;
            }

            // 得到多个四边形中，所在点距离四边形中心点最近的四边形
            function getNearestQuad(quadnodes, pos) {
                if (quadnodes.length > 0) {
                    let rtnquad = quadnodes[0];
                    let least = getDistance(pos, quadnodes[0].quad.getCenter());

                    for (let i = 1; i < quadnodes.length; i++) {
                        let quadnode = quadnodes[i];
                        let dis = getDistance(pos, quadnode.quad.getCenter());
                        if (dis < least) {
                            least = dis;
                            rtnquad = quadnode;
                        }
                    }
                    return rtnquad;
                }

                function getDistance(pos1, pos2) {
                    let x = pos1.x - pos2.x;
                    let y = pos1.y - pos2.y;
                    return x * x + y * y;
                }
            }
        }
    };

    // 绘制hover和clicked节点，每帧刷新
    ccIns.drawNode = (function () {
        let config = ccIns.Config.DEBUG_MODE;

        return function (gra) {
            gra.clear();
            if (ccIns.QuadNode.hover && ccIns.QuadNode.hover.activeInHierarchy) {
                gra.strokeColor = cc.Color[config.hoverBorderColor.toUpperCase()];
                gra.drawQuad(ccIns.QuadNode.hover.quad);
            }
            if (ccIns.QuadNode.clicked && ccIns.QuadNode.clicked.activeInHierarchy) {
                // 防止节点树移动产生bug
                let node = ccIns.getObjectFromStorage(ccIns.QuadNode.clicked.uuid).node;
                if (!node || !node.isValid) {
                    ccIns.removeObjectFromStorage(node.uuid);
                    ccIns.QuadNode.clicked = null;
                } else {
                    gra.strokeColor = cc.Color[config.clickedBorderColor.toUpperCase()];
                    gra.drawQuad(ccIns.QuadNode.clicked.quad);
                }
            }
        };
    })();

    // 更新Graphics树，包括非active
    // PS:只更新不绘制
    ccIns.updateGraphicsTree = function (quadroot, ccroot) {
        // 与DOM不同，先更新自己的
        quadroot.update(ccroot);
        // 使用不动点进行内部递归
        let fix = (f) => f(f);
        (fix(fact => (quadtree, cctree) => {
            let quadchildren = quadtree.children;
            let ccchildren = cctree.children;
            for (let i = 0; i < ccchildren.length; i++) {
                let quadnode = quadchildren[i];
                let ccnode = ccchildren[i];
                if (typeof quadnode == 'undefined') {
                    // add
                    quadtree.children.push(new ccIns.QuadNode(ccnode));
                } else if (quadnode.uuid == ccnode.uuid) {
                    // update
                    quadnode.update(ccnode);
                } else {
                    // replace
                    quadchildren.splice(i, 1, new ccIns.QuadNode(ccnode));
                }
                // 递归更新
                fact(fact)(quadchildren[i], ccnode);
            }
            // remove
            if (quadchildren.length > ccchildren.length) {
                quadchildren.splice(ccchildren.length, quadchildren.length - ccchildren.length);
            }
        }))(quadroot, ccroot);
    };
}