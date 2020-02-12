
const TipsManager = require('TipsManager');

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        bg: cc.Sprite,
        btn: cc.Button
    },

    init (menu) {
        this.index = -1;
        this.__name = '';
        this.menu = menu;
    },

    loadExample () {
        this.menu.loadScene(0, this.index);
    },

    updateItem (idx, y, name) {
        this.index = idx;
        this.node.y = y;
        this.node.x = 100;
        this.label.string = this.__name = name;
    }
});
