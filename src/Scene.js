import { Node } from '../common/engine/Node.js';

export class Scene extends Node {

    constructor(options = {}) {
        super(options);
        this.nodes = [...(options.nodes ?? [])];

    }

    getNodeByName(name) {
        for (const node of this.nodes) {
            if (node.name === name) {
                return node;
            }
        }
        return null;
    }

    addNode(node) {
        this.nodes.push(node);
    }

    traverse(before, after) {
        for (const node of this.nodes) {
            this.traverseNode(node, before, after);
        }
    }

    traverseNode(node, before, after) {
        if (before) {
            before(node);
        }
        for (const child of node.children) {
            this.traverseNode(child, before, after);
        }
        if (after) {
            after(node);
        }
    }
}
