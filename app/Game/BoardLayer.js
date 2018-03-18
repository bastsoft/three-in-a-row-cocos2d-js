const BoardLayer = cc.Layer.extend({
    ctor: function (tileArray, tileSize, midTileSize) {
        this._super();

        this.midTileSize = midTileSize;
        this.tileSize = tileSize;
        const sizeBoard = (this.tileSize * tileArray.length);
        this.width = sizeBoard;
        this.height = sizeBoard;

        tileArray.forEach((row, i) => row.forEach((cellText, j) => this._addTile(
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

            this.addChild(boardTitleLayer, 0);
        }
    }
});

export default BoardLayer;