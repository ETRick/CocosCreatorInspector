// Author: huzi(moustache)
// Date: 18-8-1 10:58
// Description: 向页面生成DOM节点树，和cc节点树单向绑定，显示cc节点的边框
export default function () {
    // 页面中需要存在cc（js）和canvas（DOM）
    if (typeof cc != 'undefined' && $('canvas').length != 0) {
        let domCanvas = $('canvas');
        let ccCanvas = cc.Canvas.instance.node;

        if (!window.Config) {
            window.Config = {};
        }
        window.Config.DEBUG_MODE = {
            lineWidth: 2,
            clickedBroderColor: "red",
            showCustomBorder: true,
            customBorderColor: "blue",
        };

        // 通过uuid生成DOM根节点
        if ($.getDOMElement(ccCanvas.uuid).length == 0) {
            let divCanvas = $.createDOMElement(ccCanvas.uuid)
                .setPositionAndSize(domCanvas.position().top, domCanvas.position().left)
                .css({
                    display: "block",
                    visibility: "hidden",
                });
            domCanvas.before(divCanvas);
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
                    let tl = cc.Node.convertRelativeCC2DOM(ccnode.getRelativeLeftTopPosition());
                    let size = ccnode.getDOMSize();
                    if (domnode.length == 0) {
                        // add 
                        let domElement = $.createDOMElement(ccnode.uuid);
                        setAllCSSAttr(domElement);
                        domtree.append(domElement);
                    } else {
                        // update
                        setAllCSSAttr(domnode).setIdAndUuid(ccnode.uuid);
                    }

                    // 设置所有和位置相关的属性
                    function setAllCSSAttr(domElement) {
                        let matrix = ccnode.getNodeToParentTransform();
                        return $(domElement)
                            .setPositionAndSize(tl.top, tl.left, size.width, size.height)
                            .setAnchor(ccnode.anchorX, 1 - ccnode.anchorY)
                            .setSkewAndRotate(matrix)
                            .css("display", ccnode.active ? "inherit" : "none");
                    }

                    // 递归更新
                    fact(fact)(domnode, ccnode);
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
