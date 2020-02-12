let materials = [];
cc.game.on(cc.game.EVENT_GAME_INITED, () => {
    cc.loader.loadResDir('transitions', cc.Material, (err, assets) => {
        if (err) {
            cc.error(err);
            return;
        }
        materials.length = 0;
        for (let i = 0; i < assets.length; i++) {
            materials.push(assets[i]);
        }
    })
})

export default materials;
