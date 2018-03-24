import ScoreMovesLayer from "./ScoreMovesLayer.js";
import ScoreTaskLayer from "./ScoreTaskLayer.js";
import MenuLayer from "./MenuLayer.js";
import model from '../levelModel.js';

const ASideLayer = cc.LayerColor.extend({
    onEnter: function () {
        this._super();

        this.changeWidthAndHeight(model.layout.aside.width, model.layout.aside.height);
        this.setColor(model.colorBoardTitle.darkGray);
        this.setPosition(cc.p(0, 0));

        const size = this.getContentSize();

        const scoreStepLayer = new ScoreMovesLayer();
        scoreStepLayer.setPosition(cc.p(size.width / 2, size.height - 100));
        this.addChild(scoreStepLayer);

        const scoreTaskLayer = new ScoreTaskLayer();
        scoreTaskLayer.setPosition(cc.p(size.width / 2, size.height - 300));
        this.addChild(scoreTaskLayer);

        const menuLayer = new MenuLayer();
        menuLayer.setPosition(cc.p(size.width / 2, 200));
        this.addChild(menuLayer);
    }
});

export default ASideLayer;