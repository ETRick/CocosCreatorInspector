// Author: huzi(moustache)
// Date: 18-8-3 9:42
// Description: util函数类，包含各种挂载到其他物体上的函数（不作为接口）
export default function () {
    /*
     * Quad class:
     *  用于描述四边形的类，包含着四个顶点。
     * 四个顶点分别为：
     *  p4     p3
     *  *------*
     *  |      |
     *  *------*
     *  p1     p2
     */
    function QuadRangle(width, height) {
        this.p0 = {x:0, y:0};
        this.p1 = {x:width, y:0};
        this.p2 = {x:width, y:height};
        this.p3 = {x:0, y:height};
        return this;
    }

    // 通过matrix2D进行顶点转换
    //          x   a c tx   ax + cy + tx
    // matrix = y · b d ty = bx + dy + ty
    //          1   0 0  1        1
    QuadRangle.prototype.transform = function (matrix) {
        for (let key of Object.keys(this)) {
            this[key] = mulMatrix(this[key], matrix);
        }
        return this;

        function mulMatrix (p, matrix) {
            return {
                x: p.x * matrix.a + p.y * matrix.c + matrix.tx,
                y: p.x * matrix.b + p.y * matrix.d + matrix.ty,
            };
        }
    };

    // 绘制四边形
    cc.Graphics.prototype.drawQuadNode = function (quadnode) {
        if (quadnode) {
            let clicked = quadnode.clicked;
            if (clicked) {
                this.strokeColor = cc.Color[window.Config.DEBUG_MODE.clickedBorderColor.toUpperCase()];
            }
            let quad = quadnode.quad;
            this.moveTo(quad.p0.x, quad.p0.y);
            for (let i = 1; quad["p" + i]; i++) {
                this.lineTo(quad["p" + i].x, quad["p" + i].y);
            }
            this.lineTo(quad.p0.x, quad.p0.y);
            // 由于颜色不一致，因此需要立即划线
            this.stroke();
            if (clicked) {
                this.strokeColor = cc.Color[window.Config.DEBUG_MODE.customBorderColor.toUpperCase()];
            }
        }
    };

    // 对应cc.node的四边形树，用于更新信息
    function QuadNode(ccnode) {
        this.uuid = ccnode.uuid;
        this.active = ccnode.active;
        this.clicked = false;  // 只有点击时显示红色
        this.quad = new QuadRangle(ccnode.width, ccnode.height);
        this.quad.transform(ccnode.getNodeToWorldTransform());
        this.children = [];
        return this;
    }
}