// Author: huzi(moustache)
// Date: 18-8-2 20:09
// Description: 高阶函数库，用于生成函数
export default function () {
    // 生成update函数，参数：
    // @param createHook: 创造新节点需要
    // @param isSameHook: 判断节点是否相同，不符合将进行替换
    // @param updateHook: 进行节点更新
    // @return 函数function(oldtree, newtree)，此函数将旧的树更新成新的树
    getUpdateTreeFunc = function (createHook, isSameHook, updateHook) {
        // 声明函数不动点，用于匿名递归
        const fix = (f) => f(f);
        return fix(fact => (oldtree, newtree) => {
            let oldchildren = oldtree.children;
            if (typeof oldchildren == 'function') {
                oldchildren = oldtree.children();
            }
            let newchildren = newtree.children;
            if (typeof newchildren == 'function') {
                newchildren = newtree.children();
            }
            for (let i = 0; i < newchildren.length; i++) {
                if (typeof oldchildren[i] == 'undefined') {
                    // add
                    oldchildren.push(createHook(newchildren[i]));
                } else if (!isSameHook(oldchildren[i], newchildren[i])) {
                    // replace
                    oldchildren.splice(i, 1, createHook(newchildren[i]));
                } else {
                    // update
                    updateHook(oldchildren[i], newchildren[i]);
                    fact(fact)(oldchildren[i], newchildren[i]);
                }
            }
            // remove
            if (oldchildren.length > newchildren.length) {
                oldchildren.splice(newchildren.length, oldchildren.length - newchildren.length);
            }
        });
    };
}