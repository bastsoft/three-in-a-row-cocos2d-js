import model from "./levelModel.js";

const PopupEndGame = cc.LayerColor.extend({
    ctor: function (isWin = true) {
        this._super();

        this.isWin = isWin;

        const ws = cc.director.getWinSize();
        const grayColor = cc.color(100, 100, 100, 0);

        this.changeWidthAndHeight(ws.width - 10, ws.height - 10);
        this.setColor(grayColor);
        this.ignoreAnchorPointForPosition(false);
        this.setPosition(cc.p(ws.width / 2, ws.height / 2));
        this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);

        const winSize = this.getContentSize();

        const layer2 = new cc.LayerColor(model.colorBoardTitle.darkGray, ws.width / 2, ws.height / 1.5);
        layer2.ignoreAnchorPointForPosition(true);
        layer2.setBlendFunc(false, false);
        this.addChild(layer2);
        layer2.x = ws.width / 4;
        layer2.y = ws.height / 4;

        const font = new cc.LabelTTF();

        font.string = this.isWin ? "Ты выиграл" : "Ты проиграл";
        font.font = "85px 'Arial'";
        font.fillStyle = cc.color(0, 0, 0);
        font.x = winSize.width / 2;
        font.y = winSize.height - 100;

        this.addChild(font);

        const items = [
            new cc.MenuItemFont("Рестарт", this.onPushRestart, this),
            new cc.MenuItemFont("Выход", this.onPushExit, this),
            new cc.MenuItemFont("+ Ходы", this.onPushAddStep, this)
        ].map((item) => {
            item.setFontSize(80);
            item.setFontName("Arial");
            return item;
        });

        this.isWin && items.pop();

        const menu = new cc.Menu(...items);
        menu.alignItemsVertically();
        menu.setPosition(winSize.width / 2, winSize.height / 2);

        this.addChild(menu);
    },

    onPushRestart() {
        cc.log("onPushRestart");
    },

    onPushExit() {
        cc.eventManager.dispatchEvent(new cc.EventCustom("close_popup"));
    },

    onPushAddStep() {
        model.setMove(-1);
        cc.eventManager.dispatchEvent(new cc.EventCustom("close_popup"));
    }
});

export default PopupEndGame;