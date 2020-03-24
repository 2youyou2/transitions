
let Transitions = cc.Class({
    extends: cc.Component,

    editor: {
        inspector: typeof Editor !== 'undefined' && Editor.url(' db://assets/resources/transitions/editor/transitions-inspector.js')
    },

    properties: {
        _material: {
            default: null,
            type: cc.Material
        },

        material: {
            get () {
                return this._material;
            },
            set (v) {
                this._material = v;
                this.updateSpriteMaterial();
            },
            type: cc.Material,
            readonly: true
        },

        transitionTime: 1
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);
    },

    start () {
        this.init();
    },

    init () {
        if (this._inited) return;
        this._inited = true;

        this.time = 0;

        this._texture1 = this.createTexture();
        this._texture2 = this.createTexture();
        
        let spriteNode = cc.find('TRANSITION_SPRITE', this.node);
        if (!spriteNode) {
            spriteNode = new cc.Node('TRANSITION_SPRITE');
            this._sprite = spriteNode.addComponent(cc.Sprite);
            spriteNode.parent = this.node;
        }
        else {
            this._sprite = spriteNode.getComponent(cc.Sprite);
        }
        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(this._texture1);
        this._sprite.spriteFrame = spriteFrame;
       
        spriteNode.active = false;
        spriteNode.scaleY = -1;
        this._spriteNode = spriteNode;

        let cameraNode = cc.find('TRANSITION_CAMERA', this.node);
        if (!cameraNode) {
            cameraNode = new cc.Node('TRANSITION_CAMERA');
            this._camera = cameraNode.addComponent(cc.Camera);
            cameraNode.parent = this.node;
        }
        else {
            this._camera = cameraNode.getComponent(cc.Camera);
        }
        cameraNode.active = false;
        this._cameraNode = cameraNode;

        this.node.groupIndex = cc.Node.BuiltinGroupIndex.DEBUG - 1;
        this._camera.cullingMask = 1 << this.node.groupIndex;

        this.updateSpriteMaterial();
    },

    updateSpriteMaterial () {
        if (!this._sprite) return;

        let newMaterial = cc.MaterialVariant.create(this._material);
        newMaterial.setProperty('texture2', this._texture2);
        newMaterial.setProperty('ratio', this._texture2.width/this._texture2.height);
        newMaterial.setProperty('screenSize', new Float32Array([this._texture2.width, this._texture2.height]));

        this._sprite.setMaterial(0, newMaterial);
        this._spriteMaterial = newMaterial;
    },

    createTexture () {
        let texture = new cc.RenderTexture();
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, cc.gfx.RB_FMT_D24S8);
        return texture;
    },

    _loadScene (sceneUrl, fromCameraPath, toCameraPath, onSceneLoaded, onTransitionFinished) {
        this.init();

        this._spriteNode.active = true;
        this._cameraNode.active = true;

        let fromCamera = cc.find(fromCameraPath);
        fromCamera = fromCamera && fromCamera.getComponent(cc.Camera);
        if (!fromCamera) {
            cc.warn(`Can not find fromCamera with path ${fromCameraPath}`);
            return;
        }
        let originTargetTexture1 = fromCamera.targetTexture;
        fromCamera.cullingMask &= ~this._camera.cullingMask;
        fromCamera.targetTexture = this._texture1;
        fromCamera.render(cc.director.getScene());
        fromCamera.targetTexture = originTargetTexture1;

        return cc.director.loadScene(sceneUrl, () => {
            onSceneLoaded && onSceneLoaded();

            let toCamera = cc.find(toCameraPath);
            toCamera = toCamera && toCamera.getComponent(cc.Camera);
            if (!toCamera) {
                cc.warn(`Can not find toCamera with path ${toCameraPath}`);
                return;
            }
            toCamera.cullingMask &= ~this._camera.cullingMask;
            let originTargetTexture2 = toCamera.targetTexture;
            toCamera.targetTexture = this._texture2;
            toCamera.render(cc.director.getScene());

            this._camera.depth = toCamera.depth;
            this._camera.clearFlags = toCamera.clearFlags;

            this._onLoadFinished = () => {
                toCamera.targetTexture = originTargetTexture2;

                this._spriteNode.active = false;
                this._cameraNode.active = false;

                onTransitionFinished && onTransitionFinished();
            }

            this.time = 0;
            this.loading = true;
        });
    },

    loadScene (sceneUrl, fromCameraPath, toCameraPath, cb) {
        this.scheduleOnce(() => {
            cc.director.preloadScene(sceneUrl, null, () => {
                this._loadScene (sceneUrl, fromCameraPath, toCameraPath, cb);
            })
        })

        return true;
    },

    loadNode (fromCamera, fromRootNode, toCamera, toRootNode, onTransitionFinished) {
        this.init();

        this._spriteNode.active = true;
        this._cameraNode.active = true;

        // from 
        fromCamera = fromCamera && fromCamera.getComponent(cc.Camera);
        if (!fromCamera) {
            cc.warn(`Can not find fromCamera with path ${fromCameraPath}`);
            return;
        }
        let originTargetTexture1 = fromCamera.targetTexture;
        fromCamera.cullingMask &= ~this._camera.cullingMask;
        fromCamera.targetTexture = this._texture1;
        fromCamera.node.active = true;
        fromRootNode.active = true;
        fromCamera.render(fromRootNode);
        fromRootNode.active = false;
        fromCamera.node.active = false;
        fromCamera.targetTexture = originTargetTexture1;

        // to
        toCamera = toCamera && toCamera.getComponent(cc.Camera);
        if (!toCamera) {
            cc.warn(`Can not find toCamera with path ${toCameraPath}`);
            return;
        }
        toCamera.cullingMask &= ~this._camera.cullingMask;
        let originTargetTexture2 = toCamera.targetTexture;
        toCamera.node.active = true;
        toCamera.targetTexture = this._texture2;
        toRootNode.active = true;
        toCamera.render(toRootNode);
        toRootNode.active = false;
        toCamera.node.active = false;

        this._camera.depth = toCamera.depth;
        this._camera.clearFlags = toCamera.clearFlags;

        this._onLoadFinished = () => {
            toRootNode.active = true;
            toCamera.node.active = true;
            toCamera.targetTexture = originTargetTexture2;

            this._spriteNode.active = false;
            this._cameraNode.active = false;

            onTransitionFinished && onTransitionFinished();
        }

        this.time = 0;
        this.loading = true;
        this._spriteMaterial.setProperty('time', 0);
    },

    update (dt) {
        if (this.loading) {
            this.time += dt;
            if (this.time >= this.transitionTime) {
                this.time = this.transitionTime;
                this.loading = false;

                this._onLoadFinished && this._onLoadFinished();
                this._onLoadFinished = null;
            }
            this._spriteMaterial.setProperty('time', this.time / this.transitionTime);
        }
    },
});
