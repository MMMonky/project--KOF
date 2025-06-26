export class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;
        this.pressed_keys = new Set(); // 存储按下的键
        this.initEventListeners();
    }

    initEventListeners() {
        this.$canvas.keydown(this.handleKeyDown.bind(this));
        this.$canvas.keyup(this.handleKeyUp.bind(this));
    }

    handleKeyDown(e) {
        this.pressed_keys.add(e.key);
    }

    handleKeyUp(e) {
        this.pressed_keys.delete(e.key);
    }
}