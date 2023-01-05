import { Light } from "./Light.js";

export class DirectionalLight extends Light {
    constructor(options = {}) {
        super(options);
        this.type = 'directional';
    }
}