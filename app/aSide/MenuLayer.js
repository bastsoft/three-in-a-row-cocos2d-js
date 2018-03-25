import model from "../levelModel.js";

const MenuLayer = cc.Layer.extend({
    onEnter() {
        this._super();

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(50);

        this.item = new cc.MenuItemFont("Бустер", this.onPushBooster, this);

        const menu = new cc.Menu(this.item);

        menu.alignItemsVertically();
        menu.setPosition(0, 0);

        this.addChild(menu);

        this._listener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "emitChangeLevelModel",
            callback: () => {
                this.item.enabled = !model.boost.used;
            }
        });

        cc.eventManager.addListener(this._listener, 1);
    },

    onExit: function () {
        cc.eventManager.removeListener(this._listener);
        this._super();
    },

    onPushBooster() {
        model.boost.used = true;
        model.boost.enable = true;
        this.item.enabled = !model.boost.used;
    }
});

export default MenuLayer;

