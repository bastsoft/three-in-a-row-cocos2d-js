const MenuLayer = cc.Layer.extend({
    ctor() {
        this._super();

        const item1 = new cc.MenuItemFont("Бустер", this.onPushBooster, this);
        const item2 = new cc.MenuItemFont("Окно проигрыша", this.onPushWindowLoose, this);
        const item3 = new cc.MenuItemFont("Окно выигрыша", this.onPushWinWindow, this);

        const menu = new cc.Menu(item1, item2, item3);

        menu.alignItemsVertically();
        menu.setPosition(0, 0);

        this.addChild(menu);
    },
    onPushBooster() {
        cc.log("onPushBooster!");
    },

    onPushWinWindow() {
        cc.eventManager.dispatchEvent(new cc.EventCustom("show_layer_win"));
    },

    onPushWindowLoose() {
        cc.eventManager.dispatchEvent(new cc.EventCustom("show_layer_loose"));
    }
});

export default MenuLayer;

