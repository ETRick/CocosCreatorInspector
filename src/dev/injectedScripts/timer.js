// Author: huzi(moustache)
// Date: 18-9-6 9:51
// Description: timer计时器，用于计时
export default function () {
    if (typeof ccIns == "undefined") {
        ccIns = {};
    }

    /* ---------- Timer 部分 ---------- */
    // 用于main中设置触发器
    ccIns.Timer = ccIns.Timer || function (interval) {
        this.timer = 0;
        this.interval = interval || 0;
        this.isRunning = true;

        // 计时器运行
        this.run = function (deltaTime) {
            if (this.isRunning) {
                this.timer += deltaTime || cc.director._deltaTime;
            }
        };

        // 计时器判断是否到达时间
        this.isTimeOut = function () {
            if (this.timer > this.interval) {
                this.timer = 0;
                return true;
            }
            return false;
        };

        // 计时器清零
        this.clearTime = function () {
            this.timer = 0;
        };
    };

    // 初始化定时器
    ccIns.Timer.node = ccIns.Timer.node || new ccIns.Timer(ccIns.Config.nodeRefleshInterval);
    ccIns.Timer.tree = ccIns.Timer.tree || new ccIns.Timer(ccIns.Config.nodeTreeRefleshInterval);
    ccIns.Timer.graphics = ccIns.Timer.graphics || new ccIns.Timer(ccIns.Config.graphicsRefleshInterval);
}