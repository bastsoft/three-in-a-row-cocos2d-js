import BoardLayer from "./BoardLayer.js";
import BallsLayer from "./BallsLayer.js";

const layout = {
    width: 760,
    height: 690
};

const GameLayer = cc.LayerColor.extend({
    init(tileArray) {
        this._super();

        this.tileArray = (tileArray || []).reverse();
        this.tileSize = 62;
        this.midTileSize = this.tileSize / 2;

        const sizeBoard = (this.tileSize * this.tileArray.length);

        this.changeWidthAndHeight(layout.width, layout.height);

        const size = this.getContentSize();
        const aSideWidth = 300;

        this.setPosition(cc.p(aSideWidth, 0));

        const backgroundLayer = cc.LayerGradient.create(
            cc.color(0x00, 0x22, 0x22, 255),
            cc.color(0x22, 0x00, 0x44, 255)
        );

        this.addChild(backgroundLayer);
        const midPoint = cc.p((size.width / 2) - sizeBoard / 2, (size.height / 2) - sizeBoard / 2);

        const boardLayer = new BoardLayer(this.tileArray, this.tileSize, this.midTileSize);
        boardLayer.setPosition(midPoint);
        this.addChild(boardLayer);

        const ballsLayer = new BallsLayer(this.tileArray, this.tileSize, this.midTileSize, midPoint);
        ballsLayer.setPosition(midPoint);
        this.addChild(ballsLayer);
    }
});

export {GameLayer, layout};