import {ASideLayer, layout as layoutASideLayer} from './ASideLayer.js';
import {GameLayer, layout as layoutGameLayer} from "./GameLayer.js";

const layout = {
    width: layoutGameLayer.width + layoutASideLayer.width,
    height: layoutGameLayer.height
};

const MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        const aside = new ASideLayer();
        const gameLayer = new GameLayer();

        gameLayer.init();

        this.addChild(aside);
        this.addChild(gameLayer);
    }
});

export {MainScene, layout};