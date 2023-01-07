import { Application } from "../common/engine/Application.js";

import { Renderer } from "./Renderer.js";
import { Physics } from "./Physics.js";
import { GLTFLoader } from "./GLTFLoader.js";

class App extends Application {
  async start() {
    const gl = this.gl;

    this.renderer = new Renderer(this.gl);

    await this.load("../assets/models/room/room.gltf");

    this.gl.canvas.addEventListener("click", (e) =>
      this.gl.canvas.requestPointerLock()
    );
    document.addEventListener("pointerlockchange", (e) => {
      if (document.pointerLockElement === this.gl.canvas) {
        this.camera.enable();
      } else {
        this.camera.disable();
      }
    });

    this.physics = new Physics(this.scene, this.camera);
    this.firstTime = true;
  }

  async load(uri) {
    this.loader = new GLTFLoader();
    await this.loader.load(uri);

    this.scene = await this.loader.loadScene(this.loader.defaultScene);
    this.scene.loader = this.loader;
    this.camera = await this.loader.loadNode("Camera");
    this.light = await this.loader.loadNode("Light");
    this.light.intensity = this.light.light.intensity;
    this.enemy = await this.loader.loadNode("Enemy");

    this.laser = await this.loader.loadNode("Laser");
    this.enemy.laser = this.laser;

    this.camera.deathSound = new Audio("../assets/sounds/death.mp3");

    // this.laser
    // this.loader.unLoadNode('Laser');

    console.log(this.enemy);
    // console.log(this.camera);
    console.log(this.scene);

    if (!this.scene || !this.camera) {
      throw new Error("Scene or Camera not present in glTF");
    }

    if (!this.camera) {
      throw new Error("Camera node does not contain a camera reference");
    }

    this.camera.updateProjection();
    this.renderer.prepareScene(this.scene);
  }

  update(time, dt) {
    if (this.endCondition) {
        if (!this.firstTime) return;
        
        document.getElementById("gameOverMenu").style.visibility = "visible";
        document.getElementById("gameOverMenu").classList.add("visible");
        
        this.scene.pilars <= 0 ? (document.getElementById("endtype").innerHTML = "You win!") : (document.getElementById("endtype").innerHTML = "You lose!");
        
        document.exitPointerLock();
        this.camera.disable();
        this.firstTime = false
        return;
    }

    if (this.scene.pilars <= 0) {
        console.log("You win!");
        this.endCondition = true;
        return;
      } else if (this.camera.hp <= 0) {
          this.camera.deathSound.play();
        this.endCondition = true;
        return;
      }



    this.camera.update(dt, time, this.light);
    this.enemy.update(dt, this.camera, time, this.light);
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

const canvas = document.querySelector("canvas");

const startButton = document.getElementById("start");

const restartButton = document.getElementById("restart");

startButton.addEventListener("click", async (e) => {
  console.log("starting game");
  const app = new App(canvas);

  await app.init();
  await app.gl.canvas.requestPointerLock();
  await app.camera.enable();
  document.querySelector(".loader-container").style.display = "none";
  document.getElementById("StartGameMenu").remove();
});

restartButton.addEventListener("click", async (e) => {
  console.log("restarting game");

  location.reload();

  const app = new App(canvas);
  await app.init();
  document.querySelector(".loader-container").style.display = "none";
  document.getElementById("gameOverMenu").style.visibility = "hidden";
});
