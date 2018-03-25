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

        this._listenerOnClosePopup = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "close_popup",
            callback: () => {
                this.removeChild(this.currentChild);
                this.currentChild = null;
            }
        });

        cc.eventManager.addListener(this._listenerOnClosePopup, 1);
    },

    onExit: function () {
        cc.eventManager.removeListener(this._listenerOnClosePopup);
        this._super();
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
            callback: () => {
                if (this.currentChild) {
                    this.removeChild(this.currentChild, true);
                }
                this.addChild(currentChild);
                this.currentChild = currentChild;
            }
        }), 1);
    }
});

export default MainScene;