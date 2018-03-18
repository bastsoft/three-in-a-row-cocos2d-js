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
        this.setPosition(cc.p(300, 0));

        const backgroundLayer = cc.LayerGradient.create(
            cc.color(0x00, 0x22, 0x22, 255),
            cc.color(0x22, 0x00, 0x44, 255)
        );

        this.addChild(backgroundLayer);


        this.boardLayer = cc.Layer.create();

        this.addChild(this.boardLayer);

        const size = this.getContentSize();

        this.boardLayer.setPosition(cc.p((size.width / 2) - sizeBoard / 2, (size.height / 2) - sizeBoard / 2));

        this._createLevel();
    },

    _createLevel() {
        this.tileArray = this.tileArray.map((row, i) => row.map((cellText, j) => this._addTile(
            j * this.tileSize + this.midTileSize,
            i * this.tileSize + this.midTileSize,
            cellText
        )));
    },

    _addTile: function (x, y, cellText) {

        if (cellText !== "x") {
            const colorBoardTitle = {
                "darkGray": cc.color(136, 136, 136),
                "whiteGray": cc.color(177, 177, 177)
            };

            this.lastTileBoard = (this.lastTileBoard !== "darkGray") ? "darkGray" : "whiteGray";

            const boardTitleLayer = new cc.LayerColor(colorBoardTitle[this.lastTileBoard]);

            boardTitleLayer.ignoreAnchor = false;
            boardTitleLayer.setContentSize(this.tileSize, this.tileSize);
            boardTitleLayer.setPosition(x, y);

            this.boardLayer.addChild(boardTitleLayer, 0);

            return boardTitleLayer;
        }

        return cellText;
    },
});

export {GameLayer, layout};