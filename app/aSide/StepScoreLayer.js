const StepScoreLayer = cc.Layer.extend({
    score: 12,
    labelScore: null,

    ctor: function () {
        this._super();

        this.init();
    },

    init: function () {
        const horizAlign = cc.TEXT_ALIGNMENT_CENTER;
        const vertAlign = cc.VERTICAL_TEXT_ALIGNMENT_CENTER;
        const blockSize = cc.size(300, 300);
        const fontSize = 60;

        this.labelScore = new cc.LabelTTF(
            "Ходы\n" + this.score,
            "Arial",
            fontSize,
            blockSize,
            horizAlign,
            vertAlign
        );

        this.labelScore.setColor(cc.color(255, 255, 255, 0));
        this.addChild(this.labelScore);
    },

    // scoreIncrease: function () {
    //     this.score -= 1;
    //     this.labelScore.setString("Ходы: " + this.score);
    // }
});

export default StepScoreLayer;