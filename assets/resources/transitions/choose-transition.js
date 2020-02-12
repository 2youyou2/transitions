

let materials = [];
cc.game.on(cc.game.EVENT_GAME_INITED, () => {
    cc.loader.loadResDir('transitions', cc.Material, (err, assets) => {
        if (err) {
            cc.error(err);
            return;
        }
        materials = assets;
    })
})

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.transitions = this.getComponent('transitions');

        if (this.transitions.material) {
            this.currentIndex = materials.indexOf(this.transitions.material);
            if (this.currentIndex === -1) {
                this.currentIndex = 0;
            }
        }
        else {
            this.currentIndex = 0;
        }
    },

    nextTransition () {
        if (!this.transitions) {
            return;
        }
        this.currentIndex++;
        if (this.currentIndex >= materials.length) {
            this.currentIndex = 0;
        }
        this.transitions.material = materials[this.currentIndex];
    },

    prevTransition () {
        if (!this.transitions) {
            return;
        }
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = materials.length - 1;
        }
        this.transitions.material = materials[this.currentIndex];
    }
});
