import {ASideLayer, layout as layoutASideLayer} from './aSide/ASideLayer.js';
import {GameLayer, layout as layoutGameLayer} from "./GameLayer.js";
import WindowLooseLayer from "./WindowLooseLayer.js";

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

        this.windowLoose = new WindowLooseLayer();

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "show_layer_loose",
            callback: this.addChild.bind(this, this.windowLoose)
        }), 1);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "hide_layer_loose",
            callback: this.removeChild.bind(this, this.windowLoose)
        }), 1);
    }
});

export {MainScene, layout};