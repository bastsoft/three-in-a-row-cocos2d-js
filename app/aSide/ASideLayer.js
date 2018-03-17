import StepScoreLayer from "./StepScoreLayer.js";

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


        const stepScoreLayer = new StepScoreLayer();
        const size = this.getContentSize();

        stepScoreLayer.setPosition(cc.p(size.width / 2, size.height - 100));

        this.addChild(stepScoreLayer);
    }
});

export {ASideLayer, layout};