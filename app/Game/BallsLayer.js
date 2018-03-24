import model from '../levelModel.js';

const BallsLayer = cc.Layer.extend({
    visitedTiles: {},
    speedAnimation: 0.5,
    animationQueue: [],

    ctor: function () {
        this._super();

        this.width = model.sizeBoard;
        this.height = model.sizeBoard;

        this.tileArray = model.board.map((row, i) => row.map((cellText, j) => this._addTile(i, j, cellText)));

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
        this._executeAnimationQueue(() => this._fallAndNewBalls(this._next.bind(this)));
    },

    _executeAnimationQueue(callbackDone) {
        const len = this.animationQueue.length;

        if (!len) {
            callbackDone(0);
        }

        this.animationQueue.forEach((sprite, i) => {
            const animationArr = sprite.animationAction;
            const isLast = i === len - 1;

            if (isLast) {
                animationArr.push(cc.callFunc(callbackDone.bind(this, len)));
            }

            sprite.runAction(cc.sequence(...animationArr));
        });

        this.animationQueue = [];
    },

    _fallAndNewBalls(callbackIfNext, count = 0) {
        this._fallDown();
        this._creatingNewBallsInTop();
        this._executeAnimationQueue((isMoveContinue) => {
            if (isMoveContinue) {
                this._fallAndNewBalls(callbackIfNext, isMoveContinue);
            } else if (count) {
                callbackIfNext();
            }
        });
    },

    _fallDown() {
        for (let i = 0; i < this.tileArray.length; i++) {
            for (let j = 0; j < this.tileArray.length; j++) {
                let isMove = false;

                if (this.tileArray[i][j] === null) {
                    isMove = this._moveFallSprite(isMove, i, j, 1);
                    isMove = this._moveFallSprite(isMove, i, j, 1, (Math.random() >= 0.5) ? 1 : -1);
                }
            }
        }
    },

    _creatingNewBallsInTop() {
        const i = this.tileArray.length - 1;
        const moveDown = cc.MoveBy.create(this.speedAnimation, new cc.Point(0, -model.tileSize));

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
                model.tileSize * addToJ * -1,
                model.tileSize * addToI * -1
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
            this._checkMatch3(mObj.match);
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

    _checkMatch3(matchByColor) {
        if (matchByColor.length > 4) {
            matchByColor = matchByColor.slice(matchByColor.length - 4);
        }

        const containsThunder = matchByColor.map(cor => (this.tileArray[cor[0]][cor[1]] || {}).isThunder).filter(Boolean);
        const isContainsThunder = containsThunder.length;

        if (matchByColor.length > 3 && !isContainsThunder) {
            let firstCor = matchByColor.pop();
            let firstSprite = this.tileArray[firstCor[0]][firstCor[1]];
            let isHorizontally = true;

            matchByColor.forEach((cor, i) => {
                isHorizontally = firstCor[0] === cor[0];
                const currentSprite = this.tileArray[cor[0]][cor[1]];

                const moveToFirst = cc.MoveTo.create(this.speedAnimation, new cc.Point(firstSprite.x + (i * 4), firstSprite.y));
                const onComplete = cc.callFunc(function () {
                    currentSprite.removeFromParent(true);
                    firstSprite.addChild(currentSprite, 0);
                    currentSprite.setPosition(
                        model.midTileSize - (i + 1) * 4,
                        model.midTileSize - (i + 1) * 4
                    );
                }, this);

                if (currentSprite) {
                    currentSprite.animationAction = [moveToFirst, onComplete];
                    this.animationQueue.push(currentSprite);

                    this.tileArray[cor[0]][cor[1]] = null;
                }
            });

            const typeThunder = isHorizontally ? "horizontally" : "vertically";
            const spriteFrame = cc.spriteFrameCache.getSpriteFrame(typeThunder);
            const spriteThunder = cc.Sprite.createWithSpriteFrame(spriteFrame);
            firstSprite.addChild(spriteThunder, 1);
            spriteThunder.setPosition(
                model.midTileSize - 10,
                model.midTileSize - 10
            );

            firstSprite.isThunder = typeThunder;
        } else {
            this._checkToRemove(matchByColor);
        }
    },

    _checkToRemove(matchByColor) {
        if (matchByColor.length > 2) {
            matchByColor.forEach(cor => this._removeTileSprite(cor[0], cor[1]));
        }
    },

    _removeTileSprite(i, j) {
        if (this.tileArray[i][j] === null || this.tileArray[i][j] === "x") {
            return true;
        }

        if (this.tileArray[i][j].isThunder) {
            this._removeThunderTile(i, j);
        }

        const currentSprite = this.tileArray[i][j];

        const bubbleBangScale = cc.scaleTo(0.5, 1.5);
        const onComplete = cc.callFunc(function () {
            this.removeFromParent(true);
        }, currentSprite);

        currentSprite.animationAction = [bubbleBangScale, onComplete];
        this.animationQueue.push(currentSprite);

        this.tileArray[i][j] = null;
    },

    _removeThunderTile(i, j) {
        const currentSprite = this.tileArray[i][j];

        for (let c = 0; c < this.tileArray.length; c++) {
            if (currentSprite.isThunder === "vertically") {
                (i !== c) && this._removeTileSprite(c, j);
            }

            if (currentSprite.isThunder === "horizontally") {
                (j !== c) && this._removeTileSprite(i, c);
            }
        }
    },

    _onMouseDown(event) {
        const aSideWidth = 300;

        const tile = {
            row: Math.floor((event._y - model.midPoint.y) / model.tileSize),
            col: Math.floor((event._x - (model.midPoint.x + aSideWidth)) / model.tileSize)
        };

        const currentSprite = (this.tileArray[tile.row] || [])[tile.col];

        if (typeof(currentSprite) === "object" && currentSprite !== null) {
            this.visitedTiles[tile.row + "-" + tile.col] = tile;

            if (currentSprite.getOpacity() === 128) {
                this._doubleClick(currentSprite, tile);
            }

            this._enabledSelect(currentSprite);
        }
    },

    _onMouseMove(event) {
        if (event._button !== null && Object.keys(this.visitedTiles).length === 1) {
            this._onMouseDown(event);
        }
    },

    _enabledSelect(currentSprite) {
        currentSprite.setOpacity(128);
    },

    _doubleClick(currentSprite, tile) {
        if (currentSprite.isThunder) {
            this._removeTileSprite(tile.row, tile.col);
            this._next();
            this.visitedTiles = {};
        }
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
                model.setMove();
            }

            this._disableSelect(firstSprite);
            this._disableSelect(secondSprite);

            this.visitedTiles = {};
        }
    },

    _disableSelect(sprite) {
        sprite.setOpacity(255);
    },

    _addTile: function (y, x, cell) {
        if (cell !== "x") {
            const tileTypes = ["yellow", "red", "blue", "purple", "green", "orange"];

            let randomTile = Math.floor(Math.random() * tileTypes.length);

            //for test value in level
            tileTypes.forEach((nameColor, i) => {
                if (cell === nameColor[0]) {
                    randomTile = i;
                }
            });

            const spriteFrame = cc.spriteFrameCache.getSpriteFrame(tileTypes[randomTile]);
            const sprite = cc.Sprite.createWithSpriteFrame(spriteFrame);

            sprite.val = randomTile;

            this.addChild(sprite, 0);

            sprite.setPosition(
                x * model.tileSize + model.midTileSize,
                y * model.tileSize + model.midTileSize
            );

            return sprite;
        }

        return cell;
    },
});

export default BallsLayer;