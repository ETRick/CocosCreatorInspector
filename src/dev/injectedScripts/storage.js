// Author: huzi(moustache)
// Date: 18-9-6 9:53
// Description: 内存储存部分，将节点储存到内存中，以便使用
export default function () {
    if (typeof ccIns == "undefined") {
        ccIns = {};
    }

    /* --------- MemoryStorage 部分 ---------- */
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
    };
}