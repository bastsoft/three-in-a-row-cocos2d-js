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
    tileSize: 62,
    countMoves: 12,
    goal: {
        count: 10,
        color: "red"
    }
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

model.setMove = function () {
    if (this.countMoves) {
        this.countMoves--;
    }

    this.changeCountMovesEvent();
};

model.setCollectedGoals = function (count = 1) {
    if (model.goal.count) {
        model.goal.count = model.goal.count - count;
    }

    this.changeGoalCountEvent();
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

model.init = function () {
    this.changeCountMovesEvent();
    this.changeGoalCountEvent();
};

export default model;