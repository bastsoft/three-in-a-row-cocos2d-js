import BoardLayer from "./BoardLayer.js";

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

        this.setPosition(cc.p(300, 0));

        const backgroundLayer = cc.LayerGradient.create(
            cc.color(0x00, 0x22, 0x22, 255),
            cc.color(0x22, 0x00, 0x44, 255)
        );

        this.addChild(backgroundLayer);


        const boardLayer = new BoardLayer(this.tileArray, this.tileSize, this.midTileSize);
        boardLayer.setPosition(cc.p((size.width / 2) - sizeBoard / 2, (size.height / 2) - sizeBoard / 2));

        this.addChild(boardLayer);
    }
});

export {GameLayer, layout};