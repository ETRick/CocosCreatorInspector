// Author: huzi(moustache)
// Date: 18-8-1 10:58
// Description: 向页面生成Graphics树，和cc节点树单向绑定，显示cc节点的边框
export default function () {
    if (typeof ccIns == "undefined") {
        ccIns = {};
    }

    /* --------- Graphics 构造部分 ---------- */
    ccIns.Config = ccIns.Config || {};

    /*
     * QuadRangle class:
     *  用于描述四边形的类，包含着四个顶点。
     * 四个顶点分别为：
     *  p4          p3
     *  *------------*
     *  |            |
     *  | height     |
     *  *------------*
     *  p1  width   p2
     */
    ccIns.QuadRangle = ccIns.QuadRangle || function (width, height) {
        this.p0 = {
            x: 0,
            y: 0
        };
        this.p1 = {
            x: width,
            y: 0
        };
        this.p2 = {
            x: width,
            y: height
        };
        this.p3 = {
            x: 0,
            y: height
        };
        return this;
    };

    // 通过matrix2D进行顶点转换
    //          x   a c tx   ax + cy + tx
    // matrix = y · b d ty = bx + dy + ty
    //          1   0 0  1        1
    ccIns.QuadRangle.prototype.transform = function (matrix) {
        for (let key of Object.keys(this)) {
            this[key] = mulMatrix(this[key], matrix);
        }
        return this;

        function mulMatrix(p, matrix) {
            return {
                x: p.x * matrix.a + p.y * matrix.c + matrix.tx,
                y: p.x * matrix.b + p.y * matrix.d + matrix.ty,
            };
        }
    };

    // 通过叉乘判断某个点是不是在区域内，当叉乘结果全为正或者全为负，则在区域内
    ccIns.QuadRangle.prototype.containPoint = function (pos) {
        let ans = [];
        for (let i = 0; i < 4; i++) {
            let vec1 = {
                x: pos.x - this["p" + i].x,
                y: pos.y - this["p" + i].y,
            };
            let vec2 = ({
                x: this["p" + (i + 1) % 4].x - this["p" + i].x,
                y: this["p" + (i + 1) % 4].y - this["p" + i].y,
            });
            ans.push(vec1.x * vec2.y - vec1.y * vec2.x);
        }
        return ans[0] * ans[1] > 0 &&
            ans[0] * ans[2] > 0 &&
            ans[0] * ans[3] > 0;
    };

    // 得到中心点
    ccIns.QuadRangle.prototype.getCenter = function () {
        return {
            x: (this.p0.x + this.p1.x + this.p2.x + this.p3.x) / 4,
            y: (this.p0.y + this.p1.y + this.p2.y + this.p3.y) / 4,
        };
    };

    // 得到面积
    ccIns.QuadRangle.prototype.area = function () {
        let area = 0;
        for (let i = 0; this["p" + (i + 1)]; i++) {
            area += Math.abs(this["p" + i].x * this["p" + (i + 1)].y +
                this["p" + i].y * this["p" + (i + 1)].x);
        }
        return area / 2;
    };

    // 绘制四边形
    if (cc.Graphics) {
        cc.Graphics.prototype.drawQuad = function (quad) {
            if (quad) {
                this.moveTo(quad.p0.x, quad.p0.y);
                for (let i = 1; quad["p" + i]; i++) {
                    this.lineTo(quad["p" + i].x, quad["p" + i].y);
                }
                this.lineTo(quad.p0.x, quad.p0.y);
                this.stroke();
            }
        };
    }

    // 对应cc.node的四边形树，用于更新信息
    //   ignoreActive对应scene
    ccIns.QuadNode = ccIns.QuadNode || function (ccnode, ignoreActive) {
        this.ignoreActive = ignoreActive;
        this.uuid = ccnode.uuid;
        // 防止scene报错
        if (!this.ignoreActive) {
            this.activeInHierarchy = ccnode.activeInHierarchy;
        }
        this.quad = new ccIns.QuadRangle(ccnode.width, ccnode.height);
        if (ccnode.getWorldMatrix) {
            setNodeToWorldTransform.call(this);
        }
        this.children = [];
        // 加入Storage
        ccIns.addObjectToStorage(this.uuid, "quadNode", this);
        return this;

        // 设置偏移矩阵
        function setNodeToWorldTransform() {
            let mat4 = cc.vmath.mat4.create();
            let vec3 = cc.vmath.vec3.create();
            vec3.x = -ccnode.anchorX * ccnode._contentSize.width;
            vec3.y = -ccnode.anchorY * ccnode._contentSize.height;
            ccnode.getWorldMatrix(mat4);
            cc.vmath.mat4.translate(mat4, mat4, vec3);
            this.quad.transform({
                a: mat4.m00,
                b: mat4.m01,
                c: mat4.m04,
                d: mat4.m05,
                tx: mat4.m12,
                ty: mat4.m13,
            });
        }
    };

    // 更新节点
    ccIns.QuadNode.prototype.update = function (ccnode) {
        this.quad = new ccIns.QuadRangle(ccnode.width, ccnode.height);
        if (ccnode.getWorldMatrix) {
            setNodeToWorldTransform.call(this);
        }
        // 防止scene报错
        if (!this.ignoreActive) {
            this.activeInHierarchy = ccnode.activeInHierarchy;
        }

        // 设置偏移矩阵
        function setNodeToWorldTransform() {
            let mat4 = cc.vmath.mat4.create();
            let vec3 = cc.vmath.vec3.create();
            vec3.x = -ccnode.anchorX * ccnode._contentSize.width;
            vec3.y = -ccnode.anchorY * ccnode._contentSize.height;
            ccnode.getWorldMatrix(mat4);
            cc.vmath.mat4.translate(mat4, mat4, vec3);
            this.quad.transform({
                a: mat4.m00,
                b: mat4.m01,
                c: mat4.m04,
                d: mat4.m05,
                tx: mat4.m12,
                ty: mat4.m13,
            });
        }
    };

    // 根节点
    ccIns.QuadNode.root = ccIns.QuadNode.root || null;
    // 当前点击节点，显示红色
    ccIns.QuadNode.clicked = ccIns.QuadNode.clicked || null;
    // 鼠标覆盖节点，显示蓝色
    ccIns.QuadNode.hover = ccIns.QuadNode.hover || null;


    /* ---------- main 中实际的使用函数 ---------- */
    // 初始化DebugGraphics节点和脚本
    ccIns.initDebugGraphicsNode = function () {
        // 页面中需要存在cc（js），cc.Graphics，并且没有生成Graphics节点
        if (cc && cc.Graphics && !cc.director._scene.getChildByName("Debug-Graphics")) {
            // 设置根节点
            ccIns.QuadNode.root = new ccIns.QuadNode(cc.director._scene, true);

            // 生成Graphics挂载节点和Graphics脚本
            let node = new cc.Node();
            node.name = "Debug-Graphics";
            node.addComponent("cc.Graphics");
            cc.director._scene.addChild(node);
            ccIns.graphicsNode = node;
            let config = ccIns.Config.DEBUG_MODE;
            node.getComponent("cc.Graphics").lineWidth = config.lineWidth;

            // 设置节点属性
            let ccCanvas = cc.Canvas.instance.node;
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
                // Quads不包括scene, DEBUG-Graphics, Canvas三个节点的quads
                let expectUuid = [];
                if (ccIns.graphicsNode) {
                    expectUuid.push(ccIns.graphicsNode.uuid);
                }
                if (cc.Canvas.instance.node) {
                    expectUuid.push(cc.Canvas.instance.node.uuid);
                }

                let arr = [];
                // 使用不动点进行内部递归
                let fix = (f) => f(f);
                (fix(fact => (quadtree, arr) => {
                    let quadchildren = quadtree.children;
                    for (let i = quadchildren.length - 1; i >= 0; i--) {
                        let quadnode = quadchildren[i];
                        // 判断是否包含
                        if (quadnode.activeInHierarchy) {
                            if (!expectUuid.hasValue(quadnode.uuid) && quadnode.quad.containPoint(pos)) {
                                arr.push(quadnode);
                            }
                            fact(fact)(quadnode, arr);
                        }
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
                        if (dis == least ? quadnode.quad.area() < rtnquad.quad.area() : dis < least) {
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
            if (gra) {
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
            }
        };
    })();

    // 更新Graphics树，包括非active
    // PS:只更新不绘制
    ccIns.updateGraphicsTree = function (quadroot, ccroot) {
        // 先更新自己的
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