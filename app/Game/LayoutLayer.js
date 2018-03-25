import BoardLayer from "./BoardLayer.js";
import BallsLayer from "./BallsLayer.js";
import model from '../levelModel.js';

const LayoutLayer = cc.LayerColor.extend({
    init() {
        this._super();

        this.changeWidthAndHeight(model.layout.board.width, model.layout.board.height);

        this.setPosition(cc.p(model.layout.aside.width, 0));

        this.addChild(cc.LayerGradient.create(
            cc.color(0x00, 0x22, 0x22, 255),
            cc.color(0x22, 0x00, 0x44, 255)
        ));
        model.setMidPoint(this.getContentSize());

        const boardLayer = new BoardLayer();
        boardLayer.setPosition(model.midPoint);
        this.addChild(boardLayer);

        const ballsLayer = new BallsLayer();
        ballsLayer.setPosition(model.midPoint);
        this.addChild(ballsLayer);
    }
});

export default LayoutLayer;