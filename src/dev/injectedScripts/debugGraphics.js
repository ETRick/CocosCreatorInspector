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

        // window.updateGraphicsTree(window.quadRoot, ccCanvas);
    }
}