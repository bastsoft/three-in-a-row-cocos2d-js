import ASideLayer from './aSide/ASideLayer.js';
import LayoutLayer from "./Game/LayoutLayer.js";
import PopupEndGame from "./PopupEndGame.js";
import globes from "../assets/globes.js";
import model from "./levelModel.js";

const MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        const aside = new ASideLayer();
        const gameLayer = new LayoutLayer();

        cc.spriteFrameCache.addSpriteFrames(...globes);

        gameLayer.init();

        this.addChild(aside);
        this.addChild(gameLayer);
        this._createWinPopup();
        this._createLoosePopup();

        model.init();
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

export default MainScene;