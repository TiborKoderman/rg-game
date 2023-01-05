import { Light } from "./Light.js";


export class SpotLight extends Light {
    constructor(options = {}) {
        super(options);
        this.type = 'spot';
        this.innerConeAngle = options.innerConeAngle ?? 0.5;
        this.outerConeAngle = options.outerConeAngle ?? 0.5;
    }
}