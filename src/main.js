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

        this.loader = new GLTFLoader();
        this.renderer = new Renderer(this.gl);
        
        await this.loader.load('../common/models/rocks/rocks.gltf')
        
        this.scene = await this.loader.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode('Camera');
        this.physics = new Physics(this.scene);

        this.camera.aspect = this.aspect;
        this.camera.camera.updateProjection();
        this.renderer.prepare(this.scene);

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }
        
        // await this.load('./src/scene.json');
        
        this.gl.canvas.addEventListener('click', e => this.gl.canvas.requestPointerLock());
        document.addEventListener('pointerlockchange', e => {
            if (document.pointerLockElement === this.gl.canvas) {
                this.camera.camera.enable();
            } else {
                this.camera.camera.disable();
            }
        });


        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
    }

    async load(uri) {
        const scene = await new SceneLoader().loadScene(uri);
        const builder = new SceneBuilder(scene);
        this.scene = builder.build();
        

        // Find first camera.
        this.camera = null;
        this.scene.traverse(node => {
            if (node instanceof Camera) {
                this.camera = node;
            }
        });

        this.camera.aspect = this.aspect;
        this.camera.updateProjection();
        this.renderer.prepare(this.scene);
    }

    update(time, dt) {
        this.camera.camera.update(dt);
        this.physics.update(dt);
    }

    render() {
        this.renderer.render(this.scene, this.camera.camera);
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.camera.updateProjection();
    }

}

const canvas = document.querySelector('canvas');
const app = new App(canvas);
await app.init();
document.querySelector('.loader-container').remove();

