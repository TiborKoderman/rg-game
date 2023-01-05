import { vec3, mat4 } from '../lib/gl-matrix-module.js';

export class Light {

    constructor(options = {}) {
        this.node = options.node ?? null;
        this.color = options.color ? vec3.clone(options.color) : [255, 255, 255];
        this.intensity = options.intensity ?? 1;
        this.type = options.type ?? 'point';
        this.attenuation = options.attenuation ?? [0.001, 0, 0.3];
    }

}
