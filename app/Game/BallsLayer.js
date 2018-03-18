const BallsLayer = cc.Layer.extend({
    visitedTiles: [],

    ctor: function (tileArray, tileSize, midTileSize, midPoint) {
        this._super();
        this.midPoint = midPoint;
        this.midTileSize = midTileSize;
        this.tileSize = tileSize;
        this.sizeBoard = (this.tileSize * tileArray.length);
        this.width = this.sizeBoard;
        this.height = this.sizeBoard;

        this.tileArray = tileArray.map((row, i) => row.map((cellText, j) => this._addTile(
            j * this.tileSize + this.midTileSize,
            i * this.tileSize + this.midTileSize,
            cellText
        )));

        const touchListener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown: this._onMouseDown.bind(this)
        });
        cc.eventManager.addListener(touchListener, this);
    },

    _onMouseDown(event) {
        const aSideWidth = 300;
        const tile = {
            row: Math.floor((event._y - this.midPoint.y) / this.tileSize),
            col: Math.floor((event._x - (this.midPoint.x + aSideWidth)) / this.tileSize)
        };

        const currentSprite = this.tileArray[tile.row][tile.col];

        this._enabledSelect(currentSprite);
        this.visitedTiles.push(tile);

        this.startColor = currentSprite.val;
    },

    _enabledSelect(currentSprite) {
        currentSprite.setOpacity(128);
        currentSprite.picked = true;
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