const model = {
    layout: {
        board: {
            width: 760,
            height: 690
        },
        aside: {
            width: 300
        }
    },
    ballsColor: ["yellow", "red", "blue", "purple", "green", "orange"],
    colorBoardTitle: {
        "darkGray": cc.color(136, 136, 136),
        "whiteGray": cc.color(177, 177, 177)
    },
    tileSize: 62,
    board: [
        ["", "", "", "", "", "x", "x", "x", "x"],
        ["", "", "", "", "", "x", "x", "x", "x"],
        ["", "", "", "", "", "x", "x", "x", "x"],
        ["", "", "", "", "", "x", "x", "x", "x"],
        ["", "", "", "", "", "x", "x", "x", "x"],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""]
    ],
    countMoves: 12,
    goal: {
        count: 10,
        color: "red"
    },
    boost: false
};

model.goal.val = model.ballsColor.indexOf(model.goal.color);

model.board = model.board.reverse();
model.midTileSize = model.tileSize / 2;

model.layout.aside.height = model.layout.board.height;

model.layout.width = model.layout.board.width + model.layout.aside.width;
model.layout.height = model.layout.board.height;

model.sizeBoard = (model.tileSize * model.board.length);

model.getColorBoardTile = function () {
    this.lastTileBoard = (this.lastTileBoard !== "darkGray") ? "darkGray" : "whiteGray";

    return model.colorBoardTitle[this.lastTileBoard];
};

model.setMidPoint = function (size) {
    this.midPoint = cc.p((size.width / 2) - this.sizeBoard / 2, (size.height / 2) - this.sizeBoard / 2);
};

model.setMove = function (count = 1) {
    this.countMoves = this.countMoves - count;

    if (this.countMoves < 0) {
        this.countMoves = 0;
    }

    this.changeCountMovesEvent();
    this.checkWinAndLoose();
};

model.setCollectedGoals = function (count = 1) {
    model.goal.count = model.goal.count - count;

    if (model.goal.count < 0) {
        model.goal.count = 0;
    }

    this.changeGoalCountEvent();
    this.checkWinAndLoose();
};

model.getBallSprite = function (type) {
    const spriteFrame = cc.spriteFrameCache.getSpriteFrame(type);

    return cc.Sprite.createWithSpriteFrame(spriteFrame);
};

model.changeGoalCountEvent = function () {
    const event = new cc.EventCustom("change_goal_count");
    event.setUserData(model.goal.count);
    cc.eventManager.dispatchEvent(event);
};

model.changeCountMovesEvent = function () {
    const event = new cc.EventCustom("change_count_moves");
    event.setUserData(model.countMoves);
    cc.eventManager.dispatchEvent(event);
};

model.checkWinAndLoose = function () {
    if (this.goal.count === 0) {
        cc.eventManager.dispatchEvent(new cc.EventCustom("show_layer_win"));
    }

    if (this.countMoves === 0) {
        cc.eventManager.dispatchEvent(new cc.EventCustom("show_layer_loose"));
    }
};

model.init = function () {
    this.changeCountMovesEvent();
    this.changeGoalCountEvent();
};

export default model;