const i18n = require('i18n');
const SceneList = require('SceneList');
const TipsManager = require('TipsManager');

const Transitions = require('transitions');
const TransitionMaterials = require('transition-materials');

const MainScene = 'TestList.fire';

const scenes = [
    'cases/scene1',
    'cases/scene2',
    MainScene
]

cc.Class({
    extends: cc.Component,

    properties: {
        btnBack: cc.Button,
        testList: cc.ScrollView,
        uiCamera: cc.Camera,
        sceneTitle: cc.Label,

        transitions: Transitions  
    },

    onLoad: function () {
        this._isLoadingScene = false;
        this.showDebugDraw = false;
        cc.game.addPersistRootNode(this.node);
        this.contentPos = null;
        this.btnBack.node.active = false;

        // keep the search scene list res
        cc.game.addPersistRootNode(this.testList.node);
        if (this.testList && this.testList.content) {
            // in main scene
            this.sceneList = this.testList.content.getComponent(SceneList);
            this.sceneList.init(this);
        }

        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._onSceneLaunched, this);

        this.sceneIndex = 0;
        this.materialIndex = 0;
    },

    _onSceneLaunched () {
        let cameras = cc.Camera.cameras;
        for (let i = 0, l = cameras.length; i < l; i++) {
            let camera = cameras[i];
            if (camera === this.uiCamera) {
                camera.cullingMask = 1 << this.node.groupIndex;
            }
            else {
                camera.cullingMask = camera.cullingMask & (~(1 << this.node.groupIndex));
            }
        }
    },

    backToList: function () {
        this.loadScene(scenes.length - 1);
    },

    loadScene: function (sceneIndex, materialIndex) {
        if (this._isLoadingScene) {
            return;
        }

        this.currentSceneIndex = sceneIndex;

        if (typeof materialIndex === 'number') {
            let material = TransitionMaterials[materialIndex];
            if (material) {
                this.transitions.material = material;
            }
        }

        let url = scenes[sceneIndex];
        // let result = cc.director.loadScene(url, this.onLoadSceneFinish.bind(this));
        let result = this.transitions.loadScene(url, 'Canvas/Main Camera', 'Canvas/Main Camera', this.onLoadSceneFinish.bind(this));
        if (!result) {
            return;
        }

        this._isLoadingScene = true;

        this.contentPos = this.testList.getContentPosition();
    },

    onLoadSceneFinish: function () {
        let isMainScene = this.currentSceneIndex === (scenes.length - 1);
        this.testList.node.active = isMainScene;
        this.btnBack.node.active = !isMainScene;
        this._isLoadingScene = false;
    },

    nextScene () {
        ++this.currentSceneIndex;
        if (this.currentSceneIndex >= scenes.length) {
            this.currentSceneIndex = 0;
        }
        this.loadScene(this.currentSceneIndex);
    },

    prevScene () {
        --this.currentSceneIndex;
        if (this.currentSceneIndex < 0) {
            this.currentSceneIndex = scenes.length - 1;
        }
        this.loadScene(this.currentSceneIndex);
    },
});
