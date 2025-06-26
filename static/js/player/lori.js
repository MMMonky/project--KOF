import { Player } from "/static/js/player/base.js";
import { GIF } from "/static/js/utils/gif.js";

export class Lori extends Player {
    constructor(root , info) {
        super(root, info);
        
        this.init_animations();
    }

    init_animations() {
        let outer = this;
        let offsets = [10, 0 , 0, -130, -10 , 10 , -190]
        for(let i = 0; i < 7 ; i ++){
            let gif = GIF();
            gif.load(`/static/images/player/Iori/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0, // 总图片数
                frame_rate: 14, // 每14帧过度一次
                offset_y: offsets[i], // y轴偏移量
                loaded: false, // 是否加载完成
                scale: 2, // 缩放比例
            });

            gif.onload = function() {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;

                if (i === 3) {
                    obj.frame_rate = 10;
                }
            }
        }
    }
}