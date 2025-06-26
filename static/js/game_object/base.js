const GAME_OBJECTS = [];

export class GameObject {
    constructor() {
        GAME_OBJECTS.push(this);
        
        this.timedelta = 0; // 时间间隔
        this.has_call_start = false; // 是否已经调用过start方法
    }

    start() { 
        // 初始执行一次
        // 子类可以重写此方法
    }

    update() { 
        // 每帧执行一次
        // 子类可以重写此方法
    }

    destroy() { 
        // 从游戏对象数组中删除当前对象
        const index = GAME_OBJECTS.indexOf(this);
        if (index !== -1) {
            GAME_OBJECTS.splice(index, 1);
        }
    }
}

// 游戏循环相关变量与函数
let last_timestamp;

const gameLoop = (timestamp) => {
    // 第一帧时初始化last_timestamp
    if (last_timestamp === undefined) {
        last_timestamp = timestamp;
    }
    
    // 处理所有游戏对象
    for (const obj of GAME_OBJECTS) {
        if (!obj.has_call_start) {
            obj.start();
            obj.has_call_start = true;
        } else {
            // 计算时间间隔
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timestamp; // 更新时间戳
    requestAnimationFrame(gameLoop); // 请求下一帧
}

// 启动游戏循环
requestAnimationFrame(gameLoop);