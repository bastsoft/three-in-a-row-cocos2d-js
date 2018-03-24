import MainScene from './MainScene.js';
import globes from '../assets/globes.js';
import model from './levelModel.js';

window.onload = () => {
    cc.game.onStart = () => {
        cc.view.setDesignResolutionSize(model.layout.width, model.layout.height, cc.ResolutionPolicy.SHOW_ALL);
        cc.LoaderScene.preload(globes, () => cc.director.runScene(new MainScene()), this);
    };

    cc.game.run("gameCanvas");
};