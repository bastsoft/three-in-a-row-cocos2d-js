let model = {
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
    tileSize: 62
};

model.layout.aside.height = model.layout.board.height;

model.layout.width = model.layout.board.width + model.layout.aside.width;
model.layout.height = model.layout.board.height;

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

    this.emitChange();
    this.checkWinAndLoose();
};

model.setCollectedGoals = function (count = 1) {
    model.goal.count = model.goal.count - count;

    if (model.goal.count < 0) {
        model.goal.count = 0;
    }

    this.emitChange();
    this.checkWinAndLoose();
};

model.getBallSprite = function (type) {
    const spriteFrame = cc.spriteFrameCache.getSpriteFrame(type);

    return cc.Sprite.createWithSpriteFrame(spriteFrame);
};

model.emitChange = function () {
    cc.eventManager.dispatchEvent(new cc.EventCustom("emitChangeLevelModel"));
};

model.checkWinAndLoose = function () {
    if (this.goal.count === 0) {
        const event = new cc.EventCustom("show_popup");
        event.setUserData(true);
        cc.eventManager.dispatchEvent(event);
    }

    if (this.countMoves === 0) {
        const event = new cc.EventCustom("show_popup");
        event.setUserData(false);
        cc.eventManager.dispatchEvent(event);
    }
};

model.init = function () {
    model.board = [
        ["", "", "", "", "", "x", "x", "x", "x"],
        ["", "", "", "", "", "x", "x", "x", "x"],
        ["", "", "", "", "", "x", "x", "x", "x"],
        ["", "", "", "", "", "x", "x", "x", "x"],
        ["", "", "", "", "", "x", "x", "x", "x"],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""]
    ];
    model.countMoves = 12;
    model.goal = {
        count: 10,
        color: "red"
    };
    model.boost = {
        used: false,
        enable: false
    };

    model.goal.val = model.ballsColor.indexOf(model.goal.color);

    model.board = model.board.reverse();
    model.midTileSize = model.tileSize / 2;

    model.sizeBoard = (model.tileSize * model.board.length);

    this.emitChange();
}
;

export default model;