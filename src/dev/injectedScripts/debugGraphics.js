// Author: huzi(moustache)
// Date: 18-8-1 10:58
// Description: 向页面生成DOM节点树，和cc节点树单向绑定，显示cc节点的边框
export default function () {
    let ccCanvas = cc.Canvas.instance.node;
    // 页面中需要存在cc（js），cc.Canvas实例，并且没有生成Graphics节点
    if (cc && ccCanvas && !ccCanvas.parent.getChildByName("Debug-Graphics")) {
        if (!window.Config) {
            window.Config = {};
        }
        window.Config.DEBUG_MODE = {
            lineWidth: 2,
            clickedBorderColor: "red",
            showCustomBorder: true,
            customBorderColor: "blue",
        };

        // 生成Graphics挂载节点
        let node = new cc.Node();
        node.name = "Debug-Graphics";
        node.addComponent("cc.Graphics");
        ccCanvas.parent.addChild(node);
        let config = window.Config.DEBUG_MODE;
        let gracom = node.getComponent("cc.Graphics");
        gracom.strokeColor = cc.Color[config.customBorderColor.toUpperCase()];
        gracom.lineWidth = config.lineWidth;

        // 使用不动点进行内部递归
        let fix = (f) => f(f);

        // 右键点击的节点
        window.rightClickQuad = undefined;
        window.quadStorage = window.quadStorage || {};
        window.quadRoot = new QuadNode(ccCanvas);
        window.quadStorage[window.quadRoot.uuid] = window.quadRoot;

        // 更新Graphics树
        window.updateGraphicsTree = (function () {
            let gra = gracom;
            let config = window.Config.DEBUG_MODE;

            return function (quadroot, ccroot) {
                // 清除上一帧节点
                gra.clear();
                // 与DOM不同，先绘制自己的节点
                quadroot.quad = new QuadRangle(ccroot.width, ccroot.height);
                quadroot.quad.transform(ccroot.getNodeToWorldTransform());
                quadroot.active = ccroot.active;
                if (quadroot.active) {
                    gra.drawQuadNode(quadroot);
                    // 绘制新的节点
                    (fix(fact => (quadtree, cctree) => {
                        let quadchildren = quadtree.children;
                        let ccchildren = cctree.children;
                        for (let i = 0; i < ccchildren.length; i++) {
                            let quadnode = quadchildren[i];
                            let ccnode = ccchildren[i];
                            if (typeof quadnode == 'undefined') {
                                // add
                                quadtree.children.push(new QuadNode(ccnode));
                                window.quadStorage[quadchildren[i].uuid] = quadchildren[i];
                            } else if (quadnode.uuid == ccnode.uuid) {
                                // update
                                quadnode.quad = new QuadRangle(ccnode.width, ccnode.height);
                                quadnode.quad.transform(ccnode.getNodeToWorldTransform());
                                quadnode.active = ccnode.active;
                            } else {
                                // replace
                                quadchildren.splice(i, 1, new QuadNode(ccnode));
                                window.quadStorage[quadchildren[i].uuid] = quadchildren[i];
                            }
                            // 只有有效才会划框和子节点框
                            if (quadchildren[i].active) {
                                gra.drawQuadNode(quadchildren[i]);
                                // 递归更新
                                fact(fact)(quadchildren[i], ccnode);
                            }
                        }
                        // remove
                        if (quadchildren.length > ccchildren.length) {
                            quadchildren.splice(ccchildren.length, quadchildren.length - ccchildren.length);
                        }
                    }))(quadroot, ccroot);
                    // 绘制新一帧节点
                }
            };
        })();

        node.anchorX = 0;
        node.anchorY = 0;
        node.width = ccCanvas.width;
        node.height = ccCanvas.height;
        node.on(cc.Node.EventType.MOUSE_MOVE, function (e) {
            getCurrentQuad(e);
        }, node);
        // window.updateGraphicsTree(window.quadRoot, ccCanvas);

        // 得到当前鼠标位置的四边形
        function getCurrentQuad(e) {
            let node = e.target;
            if (node.active) {
                let pos = e.getLocation();
                let quadnodes = getQuadsContainPos(pos);
                let quadnode = getNearestQuad(quadnodes, pos);
                console.log(quadnodes, quadnode);
                node.getComponent("cc.Graphics").drawQuadNode(quadnode);
            }
        }

        // 得到包含点的所有Quads
        function getQuadsContainPos(pos) {
            let fix = (f) => f(f);
            let quadnodes = [];
            (fix(fact => (quadtree, quadnodes) => {
                let quadchildren = quadtree.children;
                for (let i = quadchildren.length - 1; i >= 0; i--) {
                    let quadnode = quadchildren[i];
                    // 判断是否包含
                    if (quadnode.quad.containPoint(pos)) {
                        quadnodes.push(quadnode);
                    }
                    fact(fact)(quadchildren, quadnodes);
                }
            }))(window.quadRoot, quadnodes);
            return quadnodes;
        }

        // 得到多个四边形中，所在点距离四边形中心点最近的四边形
        function getNearestQuad(quadnodes, pos) {
            if (quadnodes.length > 0) {
                let rtnquad = quadnodes[0];
                let least = getDistance(pos, quadnodes[0].getCenter());

                for (let i = 1; i < quadnodes.length; i++) {
                    let quadnode = quadnodes[i];
                    let dis = getDistance(pos, quadnode.getCenter());
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
}