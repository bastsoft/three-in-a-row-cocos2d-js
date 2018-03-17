import {MainScene, layout} from './MainScene.js';
import globes from '../assets/globes.js';

window.onload = () => {
    cc.game.onStart = () => {
        cc.view.setDesignResolutionSize(layout.width, layout.height, cc.ResolutionPolicy.SHOW_ALL);
        cc.LoaderScene.preload(globes, () => cc.director.runScene(new MainScene()), this);
    };

    cc.game.run("gameCanvas");
};