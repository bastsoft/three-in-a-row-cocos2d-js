const BallsLayer = cc.Layer.extend({
    ctor: function (tileArray, tileSize, midTileSize) {
        this._super();

        this.midTileSize = midTileSize;
        this.tileSize = tileSize;
        const sizeBoard = (this.tileSize * tileArray.length);
        this.width = sizeBoard;
        this.height = sizeBoard;

        this.tileArray = tileArray.forEach((row, i) => row.forEach((cellText, j) => this._addTile(
            j * this.tileSize + this.midTileSize,
            i * this.tileSize + this.midTileSize,
            cellText
        )));
    },

    _addTile: function (x, y, cell) {
        if (cell !== "x") {
            const tileTypes = ["yellow", "red", "blue", "purple", "green", "orange"];

            const randomTile = Math.floor(Math.random() * tileTypes.length);
            const spriteFrame = cc.spriteFrameCache.getSpriteFrame(tileTypes[randomTile]);
            const sprite = cc.Sprite.createWithSpriteFrame(spriteFrame);

            sprite.val = randomTile;
            sprite.picked = false;

            this.addChild(sprite, 0);

            sprite.setPosition(x, y);

            return sprite;
        }

        return cell;
    },
});

export default BallsLayer;