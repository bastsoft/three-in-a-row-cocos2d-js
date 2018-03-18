const MenuLayer = cc.Layer.extend({
    ctor() {
        this._super();

        const item1 = new cc.MenuItemFont("Бустер", this.onPushBooster, this);
        const item2 = new cc.MenuItemFont("Окно проигрыша", this.onPushLooseWindow, this);
        const item3 = new cc.MenuItemFont("Окно выигрыша", this.onPushWinWindow, this);

        const menu = new cc.Menu(item1, item2, item3);

        menu.alignItemsVertically();
        menu.setPosition(0, 0);

        this.addChild(menu);
    },

    onPushWinWindow() {
        cc.log("onPushWinWindow!");
    },

    onPushBooster() {
        cc.log("onPushBooster!");
    },

    onPushLooseWindow() {
        cc.log("onPushLooseWindow!");
    }
});

export default MenuLayer;

