const WindowLooseLayer = cc.LayerColor.extend({
    onEnter: function () {
        this._super();

        const ws = cc.director.getWinSize();
        const grayColor = cc.color(100, 100, 100, 0);

        this.changeWidthAndHeight(ws.width - 10, ws.height - 10);
        this.setColor(grayColor);
        this.ignoreAnchorPointForPosition(false);
        this.setPosition(cc.p(ws.width / 2, ws.height / 2));
        this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);

        const winSize = this.getContentSize();
        const font = new cc.LabelTTF();

        font.font = "100px 'Arial'";
        font.string = "Ты проиграл";
        font.fillStyle = cc.color(0, 0, 0);
        this.addChild(font);
        font.x = winSize.width / 2;
        font.y = winSize.height - 100;

        const item1 = new cc.MenuItemFont("Рестарт", this.onPushRestart, this);
        item1.setFontSize(80);
        item1.setFontName("Arial");
        const item2 = new cc.MenuItemFont("Выход", this.onPushExit, this);
        item2.setFontSize(80);
        item2.setFontName("Arial");
        const item3 = new cc.MenuItemFont("+ Ходы", this.onPushAddStep, this);
        item3.setFontSize(80);
        item3.setFontName("Arial");

        const menu = new cc.Menu(item1, item2, item3);


        menu.alignItemsVertically();
        menu.setPosition(winSize.width / 2, winSize.height / 2);

        this.addChild(menu);
    },

    onPushRestart() {
        cc.log("onPushRestart");
    },

    onPushExit() {
        cc.eventManager.dispatchEvent(new cc.EventCustom("hide_layer_loose"));
    },

    onPushAddStep() {
        cc.log("onPushAddStep");
    }
});

export default WindowLooseLayer;