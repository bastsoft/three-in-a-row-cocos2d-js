import ScoreStepLayer from "./ScoreStepLayer.js";
import ScoreTaskLayer from "./ScoreTaskLayer.js";

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

        const size = this.getContentSize();

        const scoreStepLayer = new ScoreStepLayer();
        scoreStepLayer.setPosition(cc.p(size.width / 2, size.height - 100));
        this.addChild(scoreStepLayer);

        const scoreTaskLayer = new ScoreTaskLayer();
        scoreTaskLayer.setPosition(cc.p(size.width / 2, size.height - 300));
        this.addChild(scoreTaskLayer);
    }
});

export {ASideLayer, layout};