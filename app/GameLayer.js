const layout = {
    width: 760,
    height: 690
};

const GameLayer = cc.LayerColor.extend({
    init() {
        this._super();

        this.changeWidthAndHeight(layout.width, layout.height);
        this.setPosition(cc.p(300, 0));

        const backgroundLayer = cc.LayerGradient.create(
            cc.color(0x00, 0x22, 0x22, 255),
            cc.color(0x22, 0x00, 0x44, 255)
        );
        this.addChild(backgroundLayer);
    },
});

export {GameLayer, layout};