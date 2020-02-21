let Transitions = require('transitions');


cc.Class({
    extends: cc.Component,

    properties: {
        transitions: Transitions,
        
        fromRoot: cc.Node,
        fromCamera: cc.Camera,

        toRoot: cc.Node,
        toCamera: cc.Camera,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.transition(() => {
            this.scheduleOnce(() => {
                let toRoot = this.fromRoot;
                let toCamera = this.toCamera;
                this.fromRoot = this.toRoot;
                this.fromCamera = this.toCamera;
                this.toRoot = toRoot;
                this.toCamera = toCamera;
            }, 1)
        })
    },

    transition () {
        this.transitions.loadNode(this.fromCamera, this.fromRoot, this.toCamera, this.toRoot, () => {
            this.scheduleOnce(() => {
                let toRoot = this.fromRoot;
                let toCamera = this.toCamera;
                this.fromRoot = this.toRoot;
                this.fromCamera = this.toCamera;
                this.toRoot = toRoot;
                this.toCamera = toCamera;
                
                // let tmp = this.transitions._texture1;
                // this.transitions._texture1 = this.transitions._texture2;
                // this.transitions._texture2 = tmp;

                this.transition();
            }, 1)
        });
    }

    // update (dt) {},
});
