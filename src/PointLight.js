import { Light } from './Light.js';


export class PointLight extends Light {
    constructor(options = {}) {
        super(options);
        this.type = 'point';
    }
}