import { quat, vec3, mat4 } from "../lib/gl-matrix-module.js";
import { Utils } from "./Utils.js";
import { Node } from "../common/engine/Node.js";

export class FirstPersonController extends Node {
  constructor(options) {
    super(options);
    Utils.init(this, this.constructor.defaults, options);
    Utils.init(this, FirstPersonController.defaults, options);

    this.projectionMatrix = mat4.create();
    this.updateProjection();

    this.pitch = 0;
    this.yaw = this.rotation[1] * Math.PI / 180 - Math.PI/2;

    this.aiborne = false;

    this.pointermoveHandler = this.pointermoveHandler.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.keyupHandler = this.keyupHandler.bind(this);
    this.keys = {};
    // console.log("global matrix", this.globalMatrix);
  }



  updateProjection() {
    mat4.perspective(
      this.projectionMatrix,
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
  }

  update(dt) {
    const c = this;

    const cos = Math.cos(this.yaw);
    const sin = Math.sin(this.yaw);
    const forward = [-sin, 0, -cos];
    const right = [cos, 0, -sin];

    // 1: add movement acceleration
    const acc = vec3.create();
    if (this.keys["KeyW"]) {
      vec3.add(acc, acc, forward);
    }
    if (this.keys["KeyS"]) {
      vec3.sub(acc, acc, forward);
    }
    if (this.keys["KeyD"]) {
      vec3.add(acc, acc, right);
    }
    if (this.keys["KeyA"]) {
      vec3.sub(acc, acc, right);
    }
    if(this.keys["ShiftLeft"]){
      this.maxSpeed = this.sprintSpeed;
    }
    else
      this.maxSpeed = this.walkSpeed;


    // 2: update velocity
    // console.log("acc", acc);
    vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);
    // console.log("velocity", c.velocity);
    // 3: if no movement, apply friction
    if (
      (!this.keys["KeyW"] &&
      !this.keys["KeyS"] &&
      !this.keys["KeyD"] &&
      !this.keys["KeyA"])
    ) {
      vec3.scale(c.velocity, c.velocity, 1 - c.friction);
      
      // c.velocity[0] *= 1 - c.friction;
      // c.velocity[2] *= 1 - c.friction;

      if(c.velocity[0] < 0.01)
        c.velocity[0] = 0;
      
      if(c.velocity[2] < 0.01)
        c.velocity[2] = 0;

      if(Math.abs(c.velocity[1]) < 0.01)
        c.velocity[1] = 0;

    }

    // 4: limit speed
    // const speed = vec3.length(this.velocity);
    // if (speed > this.maxSpeed + this.velocity[1]) {
    //     vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed);
    // }

    const speed = Math.sqrt(this.velocity[0] * this.velocity[0] + this.velocity[2] * this.velocity[2]);
    if (speed > this.maxSpeed) {
      this.velocity[0] *= this.maxSpeed / speed;
      this.velocity[2] *= this.maxSpeed / speed;
    }


    if(this.keys["Space"] && !this.aiborne){
      this.velocity[1] = this.jumpSpeed;
      this.aiborne = true;
    }
    else if(this.aiborne){
      this.velocity[1] -= this.gravity/60;
    }

    if(this.translation[1] < 2.5){
      this.translation[1] = 2;
      this.aiborne = false;
    }

    // console.log("velocity", this.velocity);




    const rotation = quat.create();
    quat.rotateY(rotation, rotation, this.yaw);
    quat.rotateX(rotation, rotation, this.pitch);
    this.rotation = rotation;

  }

  enable() {
    document.addEventListener("pointermove", this.pointermoveHandler);
    document.addEventListener("keydown", this.keydownHandler);
    document.addEventListener("keyup", this.keyupHandler);
  }

  disable() {
    document.removeEventListener("pointermove", this.pointermoveHandler);
    document.removeEventListener("keydown", this.keydownHandler);
    document.removeEventListener("keyup", this.keyupHandler);

    for (const key in this.keys) {
      this.keys[key] = false;
    }
  }

  pointermoveHandler(e) {
    const dx = e.movementX;
    const dy = e.movementY;

    this.pitch -= dy * this.pointerSensitivity;
    this.yaw   -= dx * this.pointerSensitivity;

    const twopi = Math.PI * 2;
    const halfpi = Math.PI / 2;

    // Limit pitch so that the camera does not invert on itself.
    this.pitch = Math.min(Math.max(this.pitch, -halfpi), halfpi);

    // Constrain yaw to the range [0, pi * 2]
    this.yaw = ((this.yaw % twopi) + twopi) % twopi;
  }

  keydownHandler(e) {
    this.keys[e.code] = true;
  }

  keyupHandler(e) {
    this.keys[e.code] = false;
  }
}

FirstPersonController.defaults = {
  aspect: 1,
  fov: 1.1,
  near: 0.01,
  far: 100,
  velocity: [0, 0, 0],
  pointerSensitivity: 0.002,
  maxSpeed: 3,
  walkSpeed: 3,
  sprintSpeed: 8,
  friction: 0.2,
  acceleration: 20,
  jumpSpeed: 4,
  gravity: 9.8,
};
