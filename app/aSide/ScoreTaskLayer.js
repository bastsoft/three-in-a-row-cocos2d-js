const ScoreTaskLayer = cc.Layer.extend({
    score: 10,
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
            "Задание\n ⦁ " + this.score,
            "Arial",
            fontSize,
            blockSize,
            horizAlign,
            vertAlign
        );

        this.labelScore.setColor(cc.color(255, 255, 255, 0));
        this.addChild(this.labelScore);
    }
});

export default ScoreTaskLayer;