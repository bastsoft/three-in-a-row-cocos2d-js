import model from "../levelModel.js";

const ScoreMovesLayer = cc.Layer.extend({
    onEnter: function () {
        this._super();

        this.init();

        this._listener1 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "emitChangeLevelModel",
            callback: () => {
                this.updateLabel(model.countMoves);
            }
        });

        cc.eventManager.addListener(this._listener1, 1);
    },

    onExit: function () {
        cc.eventManager.removeListener(this._listener1);
        this._super();
    },

    updateLabel: function (countMoves) {
        if (this.labelScore) {
            this.removeChild(this.labelScore, true)
        }

        this.setNewLabelScore(countMoves);

        this.addChild(this.labelScore);
    },

    setNewLabelScore: function (countMoves) {
        const hAlign = cc.TEXT_ALIGNMENT_CENTER;
        const vAlign = cc.VERTICAL_TEXT_ALIGNMENT_CENTER;
        const blockSize = cc.size(300, 300);
        const fontSize = 60;

        this.labelScore = new cc.LabelTTF(
            "Ходы\n" + countMoves,
            "Arial",
            fontSize,
            blockSize,
            hAlign,
            vAlign
        );

        this.labelScore.setColor(cc.color(255, 255, 255, 0));
    }
});

export default ScoreMovesLayer;