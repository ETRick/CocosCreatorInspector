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
    QuadRangle = function (width, height) {
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

    // 通过叉乘判断某个点是不是在区域内，当叉乘结果全为正或者全为负，则在区域内
    QuadRangle.prototype.containPoint = function (pos) {
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
        // console.log(ans);
        return ans[0] * ans[1] > 0 && 
               ans[0] * ans[2] > 0 &&
               ans[0] * ans[3] > 0;
    };

    // 得到中心点
    QuadRangle.prototype.getCenter = function () {
        return {
            x: (this.p0.x + this.p1.x + this.p2.x + this.p3.x) / 4,
            y: (this.p0.y + this.p1.y + this.p2.y + this.p3.y) / 4,
        };
    };

    // 绘制四边形
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

    // 对应cc.node的四边形树，用于更新信息
    QuadNode = function (ccnode) {
        this.uuid = ccnode.uuid;
        this.active = ccnode.active;
        this.quad = new QuadRangle(ccnode.width, ccnode.height);
        this.quad.transform(ccnode.getNodeToWorldTransform());
        this.children = [];
        return this;
    }

    // 当前点击节点，显示红色
    QuadNode.clicked = null;

    // 覆盖节点，显示蓝色
    QuadNode.hover = null;

    // 更新节点
    QuadNode.prototype.update = function (ccnode) {
        this.quad = new QuadRangle(ccnode.width, ccnode.height);
        this.quad.transform(ccnode.getNodeToWorldTransform());
        this.active = ccnode.active;
    };
}