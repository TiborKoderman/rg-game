import { Application } from "../common/engine/Application.js";

import { Renderer } from "./Renderer.js";
import { Physics } from "./Physics.js";
import { Camera } from "./Camera.js";
import { SceneLoader } from "./SceneLoader.js";
import { SceneBuilder } from "./SceneBuilder.js";
import { GLTFLoader } from "./GLTFLoader.js";

class App extends Application {

    async start() {
        const gl = this.gl;
        
        this.renderer = new Renderer(this.gl);

        await this.load('../common/models/rocks/rocks.gltf')
        
        // this.physics = new Physics(this.scene);

        // this.renderer.prepareScene(this.scene);
        
        this.gl.canvas.addEventListener('click', e => this.gl.canvas.requestPointerLock());
        document.addEventListener('pointerlockchange', e => {
            if (document.pointerLockElement === this.gl.canvas) {
                this.camera.enable();
            } else {
                this.camera.disable();
            }
        });



    }

    async load(uri) {
        this.loader = new GLTFLoader();
        await this.loader.load(uri);

        this.scene = await this.loader.loadScene(this.loader.defaultScene);

        this.physics = new Physics(this.scene);

        this.camera = await this.loader.loadCamera('Camera');

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }


        this.camera.aspect = this.aspect;
        this.camera.updateProjection();
        this.renderer.prepareScene(this.scene);

    }

    update(time, dt) {
        this.camera.update(dt);
        this.physics.update(dt);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

}

const canvas = document.querySelector('canvas');
const app = new App(canvas);
await app.init();
document.querySelector('.loader-container').remove();

