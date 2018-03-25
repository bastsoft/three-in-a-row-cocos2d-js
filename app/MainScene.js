import ASideLayer from './aSide/ASideLayer.js';
import LayoutLayer from "./Game/LayoutLayer.js";
import PopupEndGame from "./PopupEndGame.js";
import globes from "../assets/globes.js";
import model from "./levelModel.js";

const MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        this.aside = new ASideLayer();
        this.gameLayer = new LayoutLayer();

        cc.spriteFrameCache.addSpriteFrames(...globes);

        this.addChild(this.aside);
        this.addChild(this.gameLayer);
        model.init();
        this.gameLayer.init();

        this._listenerOnShowPopup = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "show_popup",
            callback: (event) => {
                const isWin = event.getUserData();

                const currentChild = new PopupEndGame(isWin);

                if (this.currentChild) {
                    this.removeChild(this.currentChild, true);
                }

                this.addChild(currentChild);

                this.currentChild = currentChild;
            }
        });

        this._listenerOnClosePopup = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "close_popup",
            callback: () => {
                this.removeChild(this.currentChild);
                this.currentChild = null;
            }
        });

        this._listenerOnRestart = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "restart",
            callback: () => {
                this.removeChild(this.gameLayer);

                this.gameLayer = new LayoutLayer();
                this.addChild(this.gameLayer);

                this.gameLayer.init();
                model.init();
            }
        });

        cc.eventManager.addListener(this._listenerOnShowPopup, 1);
        cc.eventManager.addListener(this._listenerOnClosePopup, 1);
        cc.eventManager.addListener(this._listenerOnRestart, 1);
    },

    onExit: function () {
        cc.eventManager.removeListener(this._listenerOnShowPopup);
        cc.eventManager.removeListener(this._listenerOnClosePopup);
        cc.eventManager.removeListener(this._listenerOnRestart);
        this._super();
    }
});

export default MainScene;