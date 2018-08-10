// Author: huzi(moustache)
// Date: 18-8-3 9:42
// Description: util函数类，包含各种挂载到其他物体上的函数（不作为接口）
export default function () {
    // 初始化内存
    ccIns.gameMemoryStorage = ccIns.gameMemoryStorage || {};

    // 添加物体到内存中
    ccIns.addObjectToStorage = function (uuid, key, value) {
        ccIns.gameMemoryStorage[uuid] = ccIns.gameMemoryStorage[uuid] || {};
        ccIns.gameMemoryStorage[uuid][key] = value;
    };

    // 从内存中得到物体
    ccIns.getObjectFromStorage = function (uuid, key) {
        if (ccIns.gameMemoryStorage[uuid]) {
            if (typeof key == 'undefined') {
                return ccIns.gameMemoryStorage[uuid];
            } else {
                return ccIns.gameMemoryStorage[uuid][key];
            }
        }
    };

    // 从内存中删除物体
    ccIns.removeObjectFromStorage = function (uuid) {
        delete ccIns.gameMemoryStorage[uuid];
    }

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
    ccIns.QuadRangle = function (width, height) {
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
    }

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
        // console.log(ans);
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
    ccIns.QuadNode = function (ccnode) {
        this.uuid = ccnode.uuid;
        this.active = ccnode.active;
        this.quad = new ccIns.QuadRangle(ccnode.width, ccnode.height);
        // v2.0.0 版本
        if (ccnode.getWorldMatrix) {
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
        } else {
            // v1.4.1版本
            this.quad.transform(ccnode.getNodeToWorldTransform());
        }
        this.children = [];
        // 加入Storage
        ccIns.addObjectToStorage(this.uuid, "quadNode", this);
        return this;
    };

    // 根节点
    ccIns.QuadNode.root = null;

    // 当前点击节点，显示红色
    ccIns.QuadNode.clicked = null;

    // 覆盖节点，显示蓝色
    ccIns.QuadNode.hover = null;

    // 更新节点
    ccIns.QuadNode.prototype.update = function (ccnode) {
        this.quad = new ccIns.QuadRangle(ccnode.width, ccnode.height);
        // v2.0.0 版本
        if (ccnode.getWorldMatrix) {
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
        } else {
            // v1.4.1版本
            this.quad.transform(ccnode.getNodeToWorldTransform());
        }
        this.active = ccnode.active;
    };

}