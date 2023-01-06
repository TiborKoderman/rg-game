import { Application } from "../common/engine/Application.js";

import { Renderer } from "./Renderer.js";
import { Physics } from "./Physics.js";
import { Camera } from "./Camera.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { FirstPersonController } from "../common/engine/FirstPersonController.js";


class App extends Application {

    async start() {
        const gl = this.gl;
        
        this.renderer = new Renderer(this.gl);

        // await this.load('../common/models/rocks/rocks.gltf')
        await this.load('../assets/models/room/room.gltf')

        
        this.gl.canvas.addEventListener('click', e => this.gl.canvas.requestPointerLock());
        document.addEventListener('pointerlockchange', e => {
            if (document.pointerLockElement === this.gl.canvas) {
                this.camera.enable();
            } else {
                this.camera.disable();
            }
        });

        this.physics = new Physics(this.scene);

    }

    async load(uri) {
        this.loader = new GLTFLoader();
        await this.loader.load(uri);

        this.scene = await this.loader.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode('Camera');
        this.light = await this.loader.loadNode('Light');
        this.enemy = await this.loader.loadNode('Enemy');

        console.log(this.enemy);
        // console.log(this.camera);
        console.log(this.scene);

        
        
        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }
        
        if (!this.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }
        
        this.camera.updateProjection();
        this.renderer.prepareScene(this.scene);

    }

    update(time, dt) {
        this.camera.update(dt, time);
        this.enemy.update(dt, this.camera, time);
        this.physics.update(dt);
    }

    render() {
        this.renderer.render(this.scene, this.camera, this.light);
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjection();
    }

}

const canvas = document.querySelector('canvas');
const app = new App(canvas);
await app.init();
document.querySelector('.loader-container').remove();

