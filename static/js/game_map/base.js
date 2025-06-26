import { GameObject } from '/static/js/game_object/base.js';
import { Controller } from '/static/js/controller/base.js';

export class GameMap extends GameObject {
    constructor(root) {
        super();

        this.root = root;
        this.initCanvas();
        this.initController();
        this.initInterface();
        this.initTimer();
    }

    initCanvas() {
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();
    }

    initController() {
        this.controller = new Controller(this.$canvas);
    }

    initInterface() {
        const interfaceElement = $(`
            <div class="kof-head">
                <div class="kof-head-hp-0"><div><div></div></div></div>
                <div class="kof-head-timer">60</div>
                <div class="kof-head-hp-1"><div><div></div></div></div>
            </div>
        `);
        this.root.$kof.append(interfaceElement);
    }

    initTimer() {
        this.time_left = 60000; // 单位：毫秒
        this.$timer = this.root.$kof.find('.kof-head-timer');
    }

    update() {
        this.updateTimer();
        this.render();
    }

    updateTimer() {
        this.time_left -= this.timedelta;
        
        if (this.time_left < 0) {
            this.handleTimeUp();
        }
        
        this.$timer.text(parseInt(this.time_left / 1000));
    }

    handleTimeUp() {
        this.time_left = 0;
        
        const [playerA, playerB] = this.root.player;
        
        if (playerA.status !== 6 && playerB.status !== 6) { // 如果两个角色都没有死亡
            this.setGameOver(playerA, playerB);
        }
    }

    setGameOver(playerA, playerB) {
        playerA.status = playerB.status = 6;
        playerA.hp = playerB.hp = 0;
        playerA.frame_current_cnt = playerB.frame_current_cnt = 0;
        playerA.update_hp();
        playerB.update_hp();
        playerA.vx = playerB.vx = 0;
    }

    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}