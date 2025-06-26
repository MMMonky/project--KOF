import { GameMap } from '/static/js/game_map/base.js';
import { Kyo } from '/static/js/player/kyo.js';
import { Lori } from '/static/js/player/lori.js';

class KOF { // 定义一个基本类
    constructor(id) { // 传入一个id , 用于索引div
        this.$kof = $('#' + id) // 通过id获取div(jQuery选择器)

        this.game_map = new GameMap(this); // 创建一个GameMap对象
        this.player = [
            new Kyo(this,{
                id: 0,
                x: 200,
                y: 0,
                width: 120,
                height: 200,
                color: 'blue',
            }),
            new Lori(this, {
                id: 1,
                x: 900,
                y: 0,
                width: 120,
                height: 200,
                color: 'red',
            })
        ]
    }
}

export {
    KOF
}