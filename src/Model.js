import { Node } from '../common/engine/Node.js';

export class Model extends Node {

    constructor(mesh, image, options) {
        super(options);
        this.mesh = mesh;
        this.image = image;
    }

}
