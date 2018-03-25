import model from "../levelModel.js";

const ScoreGoalLayer = cc.Layer.extend({
    score: 10,
    labelScore: null,

    onEnter: function () {
        this._super();

        this._listener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "emitChangeLevelModel",
            callback: () => {
                this.updateLabel(model.goal.count);
            }
        });

        cc.eventManager.addListener(this._listener, 1);

        this.init();
    },

    onExit: function () {
        cc.eventManager.removeListener(this._listener);
        this._super();
    },

    updateLabel: function (count) {
        if (this.labelScore) {
            this.removeChild(this.labelScore, true);
            this.removeChild(this.spriteBall, true);
        }

        this.setNewLabelScore(count);

        this.addChild(this.labelScore);

        this.spriteBall = model.getBallSprite(model.goal.color);
        this.spriteBall.x = count.toString().length > 1 ? -35 : -25;
        this.spriteBall.y = -35;
        this.addChild(this.spriteBall);
    },

    setNewLabelScore: function (count) {
        const horizAlign = cc.TEXT_ALIGNMENT_CENTER;
        const vertAlign = cc.VERTICAL_TEXT_ALIGNMENT_CENTER;
        const blockSize = cc.size(300, 300);
        const fontSize = 60;

        this.labelScore = new cc.LabelTTF(
            "Задание\n ⦁ " + count,
            "Arial",
            fontSize,
            blockSize,
            horizAlign,
            vertAlign
        );

        this.labelScore.setColor(cc.color(255, 255, 255, 0));
    }
});

export default ScoreGoalLayer;