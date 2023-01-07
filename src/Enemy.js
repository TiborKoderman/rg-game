import { Node } from "../common/engine/Node.js";
import { quat, vec3, mat4 } from "../lib/gl-matrix-module.js";
import { GLTFLoader } from "./GLTFLoader.js";

export class Enemy extends Node {

    constructor(options = {}) {
        super(options);
        this.hitPoints = options.hitPoints ?? 100;
        // this.velocity = options.velocity ?? [2,1,1];

        this.pitch = 0;
        this.yaw = 0;

        console.log("Enemy created");

        this.timeOfLastShot = 0;
        this.nextAttackTime = Math.random() * 10 + 1;

        this.laserSound = new Audio("../assets/sounds/laser.mp3");

    }

    update(dt, player, time, light){

        //face towards player
        
        let angleToPlayer = this.calculateAngleToPlayer(player);

        // console.log("angle to player", angleToPlayer);
        // check which direction is nearest to turn towards the player

        let angle_diff = angleToPlayer - this.yaw;

        if(angle_diff > Math.PI){
            angle_diff -= 2*Math.PI;
        }
        if(angle_diff < -Math.PI){
            angle_diff += 2*Math.PI;
        }
        
        this.yaw += angle_diff * dt * 1.2;
        
        const rotation = quat.create();
        quat.rotateY(rotation, rotation, this.yaw- Math.PI/2);
        this.rotation = rotation;


        //rotate laser towards player and move it so it's offset from the enemy by 1 unit, the laser is rotated 90 degrees so it points in the right direction
        const laserRotation = quat.create();
        //periodically rotate laser around it's own axis
        quat.rotateY(laserRotation, laserRotation, this.yaw);
        quat.rotateX(laserRotation, laserRotation, Math.PI/2);



        this.laser.rotation = laserRotation;

        //move the laser by 8 units in the direction it's facing
        const laserTranslation = vec3.create();
        vec3.subtract(laserTranslation, laserTranslation, [-Math.sin(this.yaw), 0, -Math.cos(this.yaw)]);
        vec3.scale(laserTranslation, laserTranslation, 13);
        this.laser.translation = laserTranslation;



        //floating effect
        this._translation[1] = Math.sin(time) * 0.5 + 3;

        //if attacking move the laser with the enemy, if not move it out of the reference frame this makes it 
        if(this.attacking){
            this.laser._translation[1] = this._translation[1];
        }
        else{
            this.laser._translation[1] = 10;
        }



        //one second before attacking, flicker the light 3 times
        if(time > this.timeOfLastShot + this.nextAttackTime - 1){
            if(time % 0.2 < 0.1){
                light.light.intensity = 20;
            }
            else{
                light.light.intensity = light.intensity;
            }
        }
        else{
            light.light.intensity = light.intensity;
        }


        // attack after a random pause and attack for a random amount of time
        if(time > this.timeOfLastShot + this.nextAttackTime){
            this.attacking = true;
            this.laserSound.play();
            this.timeOfLastShot = time;
            this.nextAttackTime = Math.random() * 10 + 5;
        }
        //stop attacking after 3 seconds
        if(time > this.timeOfLastShot + 2){
            this.attacking = false;
        }



    }

    calculateAngleToPlayer(player){

        
        return Math.atan2(player.translation[0] - this.translation[0], player.translation[2] - this.translation[2]);

    }

    takeDamage(damage){
        this.hitPoints -= damage;
        console.log("Enemy took damage");
    }



}