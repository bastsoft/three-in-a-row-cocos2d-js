import model from "../levelModel.js";

const MenuLayer = cc.Layer.extend({
    onEnter() {
        this._super();

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(50);

        this.item = new cc.MenuItemFont("Бустер", this.onPushBooster, this);
        const item2 = new cc.MenuItemFont("проигрыш", this.onPushWindowLoose, this);
        const item3 = new cc.MenuItemFont("выигрыш", this.onPushWinWindow, this);

        const menu = new cc.Menu(this.item, item2, item3);

        menu.alignItemsVertically();
        menu.setPosition(0, 0);

        this.addChild(menu);
    },

    onPushBooster() {
        this.item.enabled = false;
        model.boost = true;
    },

    onPushWinWindow() {
        cc.eventManager.dispatchEvent(new cc.EventCustom("show_layer_win"));
    },

    onPushWindowLoose() {
        cc.eventManager.dispatchEvent(new cc.EventCustom("show_layer_loose"));
    }
});

export default MenuLayer;

