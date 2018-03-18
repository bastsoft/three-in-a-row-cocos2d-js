import {ASideLayer, layout as layoutASideLayer} from './aSide/ASideLayer.js';
import {GameLayer, layout as layoutGameLayer} from "./Game/GameLayer.js";
import PopupEndGame from "./PopupEndGame.js";
import globes from "../assets/globes.js";

const layout = {
    width: layoutGameLayer.width + layoutASideLayer.width,
    height: layoutGameLayer.height
};

const MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        const aside = new ASideLayer();
        const gameLayer = new GameLayer();

        cc.spriteFrameCache.addSpriteFrames(...globes);

        gameLayer.init([
            ["", "", "", "", "", "x", "x", "x", "x"],
            ["", "", "", "", "", "x", "x", "x", "x"],
            ["", "", "", "", "", "x", "x", "x", "x"],
            ["", "", "", "", "", "x", "x", "x", "x"],
            ["", "", "", "", "", "x", "x", "x", "x"],
            ["", "", "", "", "", "", "", "", "b"],
            ["", "", "", "", "", "", "", "", "b"],
            ["", "y", "y", "y", "y", "", "", "", "b"],
            ["r", "r", "r", "r", "", "", "", "", "b"]
        ]);

        this.addChild(aside);
        this.addChild(gameLayer);
        this._createWinPopup();
        this._createLoosePopup();
    },

    _createWinPopup() {
        this._addListenerToPopup(true);
    },

    _createLoosePopup() {
        this._addListenerToPopup(false);
    },

    _addListenerToPopup(isWin) {
        const currentChild = new PopupEndGame(isWin);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: isWin ? "show_layer_win" : "show_layer_loose",
            callback: this.addChild.bind(this, currentChild)
        }), 1);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: isWin ? "hide_layer_win" : "hide_layer_loose",
            callback: this.removeChild.bind(this, currentChild)
        }), 1);
    }
});

export {MainScene, layout};