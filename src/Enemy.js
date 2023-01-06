import { Node } from "../common/engine/Node.js";
import { quat, vec3, mat4 } from "../lib/gl-matrix-module.js";

export class Enemy extends Node {

    constructor(options = {}) {
        super(options);
        this.hitPoints = options.hitPoints ?? 100;
        // this.velocity = options.velocity ?? [2,1,1];

        this.pitch = 0;
        this.yaw = 0;

        console.log("Enemy created");
    }

    update(dt, player, time){

        //face towards player
        
        this.yaw = this.calculateAngleToPlayer(player);

        // console.log(this.yaw);

        const rotation = quat.create();
        quat.rotateY(rotation, rotation, this.yaw- Math.PI/2);
        this.rotation = rotation;

        //hover animation
        this._translation[1] = Math.sin(time) * 0.5 + 3sd;



        // console.log(this.translation);
        // console.log(player.translation)
    }

    calculateAngleToPlayer(player){

        
        return Math.atan2(player.translation[0] - this.translation[0], player.translation[2] - this.translation[2]);

    }

    takeDamage(damage){
        this.hitPoints -= damage;
        console.log("Enemy took damage");
    }



}