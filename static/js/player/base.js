import { GameObject } from "/static/js/game_object/base.js";

export class Player extends GameObject {
    constructor(root, info) {
        super();

        // 基本属性初始化
        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        // 移动相关属性
        this.direction = 1; // 1: 右, -1: 左
        this.vx = 0;
        this.vy = 0;
        this.speedx = 400;
        this.speedy = -1000;
        this.gravity = 20;

        // 游戏状态相关
        this.ctx = this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;
        this.status = 3; // 0:站立, 1:向前, 2:向后, 3:跳跃, 4:攻击, 5:被攻击, 6:死亡
        this.animations = new Map();
        this.frame_current_cnt = 0;

        // 血量相关
        this.hp = 100;
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
        this.$hp_div = this.$hp.find('div');
    }

    start() {
        // 初始化逻辑，当前为空
    }

    update_control() {
        // 获取按键状态
        const keys = this._get_control_keys();
        const { w, a, d, space } = keys;

        // 只有在特定状态下才能改变状态
        if (this.status === 0 || this.status === 1 || this.status === 2) {
            if (space) {
                this._handle_attack();
            } else if (w) {
                this._handle_jump(a, d);
            } else if (d) {
                this._handle_move_right();
            } else if (a) {
                this._handle_move_left();
            } else {
                this._handle_stand();
            }
        }
    }

    _get_control_keys() {
        if (this.id === 0) {
            return {
                w: this.pressed_keys.has('w'),
                a: this.pressed_keys.has('a'),
                d: this.pressed_keys.has('d'),
                space: this.pressed_keys.has(' ')
            };
        } else {
            return {
                w: this.pressed_keys.has('ArrowUp'),
                a: this.pressed_keys.has('ArrowLeft'),
                d: this.pressed_keys.has('ArrowRight'),
                space: this.pressed_keys.has('Enter')
            };
        }
    }

    _handle_attack() {
        this.status = 4;
        this.vx = 0;
        this.frame_current_cnt = 0;
    }

    _handle_jump(is_left, is_right) {
        if (is_right) {
            this.vx = this.speedx;
        } else if (is_left) {
            this.vx = -this.speedx;
        } else {
            this.vx = 0;
        }
        this.vy = this.speedy;
        this.status = 3;
        this.frame_current_cnt = 0;
    }

    _handle_move_right() {
        this.vx = this.speedx;
        this.status = 1;
    }

    _handle_move_left() {
        this.vx = -this.speedx;
        this.status = 2;
    }

    _handle_stand() {
        this.vx = 0;
        this.status = 0;
    }

    update_move() {
        // 更新重力和位置
        this.vy += this.gravity;
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        // 边界检查
        this._check_ground();
        this._check_boundaries();
    }

    _check_ground() {
        const GROUND_Y = 450;
        if (this.y > GROUND_Y) {
            this.y = GROUND_Y;
            this.vy = 0;
            if (this.status === 3) {
                this.status = 0;
            }
        }
    }

    _check_boundaries() {
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.width;
        }
    }

    update_direction() {
        if (this.status === 6) {
            return; // 死亡后不改变方向
        }

        const players = this.root.player;
        if (players[0] && players[1]) {
            const me = this;
            const you = players[1 - this.id];
            this.direction = me.x < you.x ? 1 : -1;
        }
    }

    is_attack() {
        if (this.status === 6) return; // 死亡后不再受到攻击

        this.status = 5;
        this.frame_current_cnt = 0;
        this.hp = Math.max(this.hp - 20, 0);
        this.update_hp();
        
        if (this.hp === 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
        }
    }

    is_collision(r1, r2) {
        return !(
            Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2) ||
            Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2)
        );
    }

    update_attack() {
        if (this.status === 4 && this.frame_current_cnt === 18) {
            const players = this.root.player;
            const me = this;
            const you = players[1 - this.id];
            
            const r1 = this._get_attack_rect();
            const r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height
            };

            if (this.is_collision(r1, r2)) {
                you.is_attack();
            }
        }
    }

    _get_attack_rect() {
        const ATTACK_WIDTH = 100;
        const ATTACK_HEIGHT = 20;
        const HAND_OFFSET_X = 120;
        const HAND_OFFSET_Y = 40;

        if (this.direction > 0) {
            return {
                x1: this.x + HAND_OFFSET_X,
                y1: this.y + HAND_OFFSET_Y,
                x2: this.x + HAND_OFFSET_X + ATTACK_WIDTH,
                y2: this.y + HAND_OFFSET_Y + ATTACK_HEIGHT
            };
        } else {
            return {
                x1: this.x + this.width - HAND_OFFSET_X - ATTACK_WIDTH,
                y1: this.y + HAND_OFFSET_Y,
                x2: this.x + this.width - HAND_OFFSET_X,
                y2: this.y + HAND_OFFSET_Y + ATTACK_HEIGHT
            };
        }
    }

    update_hp() {
        console.log(this.$hp);
        this.$hp_div.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 300);

        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 600);
    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();
        this.render();
    }

    render() {
        let status = this._get_render_status();
        const obj = this.animations.get(status);
        
        if (obj && obj.loaded) {
            this._render_animation(obj);
            this._update_animation_state(status, obj);
        }

        this.frame_current_cnt++;
    }

    _get_render_status() {
        // 如果向前但实际在向后移动，切换状态
        if (this.status === 1 && this.direction * this.vx < 0) {
            return 2;
        }
        return this.status;
    }

    _render_animation(obj) {
        const k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
        const image = obj.gif.frames[k].image;
        
        if (this.direction > 0) {
            // 正向渲染
            this.ctx.drawImage(
                image, 
                this.x, 
                this.y + obj.offset_y, 
                image.width * obj.scale, 
                image.height * obj.scale
            );
        } else {
            // 反向渲染
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.translate(-this.ctx.canvas.width, 0);
            
            this.ctx.drawImage(
                image, 
                this.ctx.canvas.width - this.width - this.x, 
                this.y + obj.offset_y, 
                image.width * obj.scale, 
                image.height * obj.scale
            );
            
            this.ctx.restore();
        }
    }

    _update_animation_state(status, obj) {
        const last_frame = obj.frame_rate * (obj.frame_cnt - 1);
        
        // 攻击或被攻击完成后恢复站立
        if ((status === 4 || status === 5) && this.frame_current_cnt === last_frame) {
            this.status = 0;
            this.frame_current_cnt = 0;
        }

        // 死亡状态保持在最后一帧
        if (status === 6 && this.frame_current_cnt === last_frame) {
            this.frame_current_cnt--;
        }
    }
}