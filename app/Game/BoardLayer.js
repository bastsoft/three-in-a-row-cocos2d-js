import model from '../levelModel.js';

const BoardLayer = cc.Layer.extend({
    onEnter: function () {
        this._super();

        this.width = model.sizeBoard;
        this.height = model.sizeBoard;

        model.board.forEach((row, i) => row.forEach((cellText, j) => this._addTile(
            j * model.tileSize + model.midTileSize,
            i * model.tileSize + model.midTileSize,
            cellText
        )));
    },

    _addTile: function (x, y, cellText) {
        if (cellText !== "x") {
            const boardTitleLayer = new cc.LayerColor(model.getColorBoardTile());

            boardTitleLayer.ignoreAnchor = false;
            boardTitleLayer.setContentSize(model.tileSize, model.tileSize);
            boardTitleLayer.setPosition(x, y);

            this.addChild(boardTitleLayer, 0);
        }
    }
});

export default BoardLayer;