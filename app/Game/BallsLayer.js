const BallsLayer = cc.Layer.extend({
    visitedTiles: {},
    speedAnimation: 0.5,
    animationQueue: [],

    ctor: function (tileArray, tileSize, midTileSize, midPoint) {
        this._super();
        this.midPoint = midPoint;
        this.midTileSize = midTileSize;
        this.tileSize = tileSize;
        this.sizeBoard = (this.tileSize * tileArray.length);
        this.width = this.sizeBoard;
        this.height = this.sizeBoard;

        this.tileArray = tileArray.map((row, i) => row.map((cellText, j) => this._addTile(i, j, cellText)));

        let touchListener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown: this._onMouseDown.bind(this),
            onMouseUp: this._onMouseUp.bind(this),
            onMouseMove: this._onMouseMove.bind(this)
        });

        cc.eventManager.addListener(touchListener, this);

        this._next();
    },

    _next() {
        this._checkMatch();
        this._executeAnimationQueue(() => {
            this._fallDown(count => {
                if (count) {
                    this._next();
                }
            });

        });
    },

    _executeAnimationQueue(callbackDone) {
        if (!this.animationQueue.length) {
            callbackDone();
        }

        this.animationQueue.forEach((sprite, i) => {
            const animationArr = sprite.animationAction;
            const isLast = i === this.animationQueue.length - 1;

            if (isLast) {
                animationArr.push(cc.callFunc(callbackDone, this));
            }

            sprite.runAction(cc.sequence(...animationArr));
        });

        this.animationQueue = [];
    },

    _fallDown(callback, count = 0) {
        let isMoveContinue = 0;

        for (let i = 0; i < this.tileArray.length; i++) {
            for (let j = 0; j < this.tileArray.length; j++) {
                let isMove = false;

                if (this.tileArray[i][j] === null) {
                    isMove = this._moveFallSprite(isMove, i, j, 1);
                    isMove = this._moveFallSprite(isMove, i, j, 1, (Math.random() >= 0.5) ? 1 : -1);
                }

                isMoveContinue += isMove;
            }
        }

        this._creatingNewBallsInTop();
        this._executeAnimationQueue(() => {
            if (isMoveContinue) {
                count = count + 1;
                count = this._fallDown(callback, count);
            } else {
                callback(count);
            }
        });
    },

    _creatingNewBallsInTop() {
        const i = this.tileArray.length - 1;
        const moveDown = cc.MoveBy.create(this.speedAnimation, new cc.Point(0, -this.tileSize));

        for (let j = 0; j < this.tileArray.length - 1; j++) {
            const currentCell = this.tileArray[i][j];

            if (currentCell === null) {
                const newSprite = this._addTile(i + 1, j, currentCell);

                newSprite.animationAction = [moveDown.clone()];
                this.animationQueue.push(newSprite);
                this.tileArray[i][j] = newSprite;
            }
        }
    },

    _moveFallSprite(isMove, i, j, addToI = 0, addToJ = 0) {
        const isCeiling = i === this.tileArray.length - 1;
        const upIsNotX = !isCeiling && this.tileArray[i + 1][j] && this.tileArray[i + 1][j] !== "x";
        const leftIsNotX = !isCeiling && this.tileArray[i + 1][j + 1] && this.tileArray[i + 1][j + 1] !== "x" && this.tileArray[i + 1][j] !== "x";
        const rightIsNotX = !isCeiling && this.tileArray[i + 1][j - 1] && this.tileArray[i + 1][j - 1] !== "x" && this.tileArray[i + 1][j] !== "x";
        let condition = upIsNotX;

        if (addToJ === 1) {
            condition = leftIsNotX;
        }

        if (addToJ === -1) {
            condition = rightIsNotX;
        }

        if (!isMove && condition) {
            const sprite = this.tileArray[i + addToI][j + addToJ];

            sprite.animationAction = [cc.MoveBy.create(this.speedAnimation, new cc.Point(
                this.tileSize * addToJ * -1,
                this.tileSize * addToI * -1
            ))];

            this.animationQueue.push(sprite);

            this.tileArray[i][j] = sprite;
            this.tileArray[i + addToI][j + addToJ] = null;

            isMove = true;
        }

        return isMove;
    },

    _checkMatch() {
        const matchByRow = {match: []};
        const matchByCol = {match: []};

        for (let i = 0; i < this.tileArray.length; i++) {
            for (let j = 0; j < this.tileArray.length; j++) {
                this._matchProcessing(matchByRow, i, j, true);
                this._matchProcessing(matchByCol, j, i, false);
            }
        }
    },

    _matchProcessing(mObj, i, j, isRow) {
        if (mObj.match.length && this._isMatchCurrentSprite(mObj.match, i, j, isRow)) {
            mObj.match.push([i, j]);
        } else {
            this._checkToRemove(mObj.match);
            mObj.match = (this.tileArray[i][j] && this.tileArray[i][j] !== "x") ? [[i, j]] : [];
        }
    },

    _isMatchCurrentSprite(matchByColor, i, j, isRow) {
        const firstCor = matchByColor[0];

        if (firstCor && this.tileArray[firstCor[0]][firstCor[1]]) {
            const firstElem = this.tileArray[firstCor[0]][firstCor[1]].val;
            const currentElem = (this.tileArray[i][j] || {}).val;
            const siblings = isRow ? firstCor[0] === i : firstCor[1] === j;

            return firstElem !== undefined && siblings && firstElem === currentElem;
        }

        return false;
    },

    _checkToRemove(matchByColor) {
        if (matchByColor.length > 2) {
            matchByColor.forEach(cor => {
                const currentSprite = this.tileArray[cor[0]][cor[1]];
                const bubbleBangScale = cc.scaleTo(0.5, 1.5);
                const onComplete = cc.callFunc(function () {
                    this.removeFromParent(true);
                }, currentSprite);

                currentSprite.animationAction = [bubbleBangScale, onComplete];
                this.animationQueue.push(currentSprite);

                this.tileArray[cor[0]][cor[1]] = null;
            });
        }
    },

    _onMouseDown(event) {
        const aSideWidth = 300;

        const tile = {
            row: Math.floor((event._y - this.midPoint.y) / this.tileSize),
            col: Math.floor((event._x - (this.midPoint.x + aSideWidth)) / this.tileSize)
        };

        const currentSprite = (this.tileArray[tile.row] || [])[tile.col];

        if (typeof(currentSprite) === "object" && currentSprite !== null) {
            this._enabledSelect(currentSprite);
            this.visitedTiles[tile.row + "-" + tile.col] = tile;
        }
    },

    _onMouseMove(event) {
        if (event._button !== null && Object.keys(this.visitedTiles).length === 1) {
            this._onMouseDown(event);
        }
    },

    _enabledSelect(currentSprite) {
        currentSprite.setOpacity(128);
        currentSprite.picked = true;
    },

    _onMouseUp() {
        if (Object.keys(this.visitedTiles).length === 2) {
            const k0 = Object.keys(this.visitedTiles)[0];
            const k1 = Object.keys(this.visitedTiles)[1];
            const row0 = this.visitedTiles[k0].row;
            const col0 = this.visitedTiles[k0].col;
            const row1 = this.visitedTiles[k1].row;
            const col1 = this.visitedTiles[k1].col;
            const difRow = Math.abs(row0 - row1);
            const difCol = Math.abs(col0 - col1);
            const firstSprite = this.tileArray[row0][col0];
            const secondSprite = this.tileArray[row1][col1];

            if ((difRow + difCol) === 1) {
                const moveAction1 = cc.MoveTo.create(this.speedAnimation, new cc.Point(firstSprite.x, firstSprite.y));
                const moveAction2 = cc.MoveTo.create(this.speedAnimation, new cc.Point(secondSprite.x, secondSprite.y));


                const onComplete = cc.callFunc(function () {
                    this._next();
                }, this);

                secondSprite.runAction(cc.sequence(moveAction1, onComplete));
                firstSprite.runAction(moveAction2);

                this.tileArray[row0][col0] = secondSprite;
                this.tileArray[row1][col1] = firstSprite;
            }

            this._disableSelect(firstSprite);
            this._disableSelect(secondSprite);

            this.visitedTiles = {};
        }
    },

    _disableSelect(sprite) {
        sprite.setOpacity(255);
        sprite.picked = false;
    },

    _addTile: function (y, x, cell) {
        if (cell !== "x") {
            const tileTypes = ["yellow", "red", "blue", "purple", "green", "orange"];

            let randomTile = Math.floor(Math.random() * tileTypes.length);

            //for test value in level
            tileTypes.forEach((nameColor, i) => {
                if(cell === nameColor[0]){
                    randomTile = i;
                }
            });

            const spriteFrame = cc.spriteFrameCache.getSpriteFrame(tileTypes[randomTile]);
            const sprite = cc.Sprite.createWithSpriteFrame(spriteFrame);

            sprite.val = randomTile;
            sprite.picked = false;

            this.addChild(sprite, 0);

            sprite.setPosition(
                x * this.tileSize + this.midTileSize,
                y * this.tileSize + this.midTileSize
            );

            return sprite;
        }

        return cell;
    },
});

export default BallsLayer;