const layout = {
    width: 300
};

const ASideLayer = cc.LayerColor.extend({
    onEnter: function () {
        this._super();

        const ws = cc.director.getWinSize();
        const grayColor = cc.color(100, 100, 100, 128);

        this.changeWidthAndHeight(layout.width, ws.height);
        this.setColor(grayColor);
        this.setPosition(cc.p(0, 0));
    }
});

export {ASideLayer, layout};