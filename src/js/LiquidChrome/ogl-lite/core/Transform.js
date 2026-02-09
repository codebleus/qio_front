import { Vec3 } from "../math/Vec3.js";
import { Quat } from "../math/Quat.js";
import { Mat4 } from "../math/Mat4.js";

export class Transform {
  constructor() {
    this.parent = null;
    this.children = [];

    this.position = new Vec3();
    this.quaternion = new Quat();
    this.scale = new Vec3(1, 1, 1);

    this.matrix = new Mat4();
    this.worldMatrix = new Mat4();
    this.matrixAutoUpdate = true;
  }

  add(child) {
    if (child.parent) child.parent.remove(child);
    child.parent = this;
    this.children.push(child);
    return this;
  }

  remove(child) {
    const i = this.children.indexOf(child);
    if (i !== -1) {
      this.children.splice(i, 1);
      child.parent = null;
    }
    return this;
  }

  updateMatrix() {
    this.matrix.fromRotationTranslationScale(
      this.quaternion,
      this.position,
      this.scale,
    );
  }

  updateMatrixWorld() {
    if (this.matrixAutoUpdate) this.updateMatrix();

    if (!this.parent) this.worldMatrix.copy(this.matrix);
    else this.worldMatrix.multiply(this.parent.worldMatrix, this.matrix);

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateMatrixWorld();
    }
  }

  traverse(cb) {
    cb(this);
    for (let i = 0; i < this.children.length; i++)
      this.children[i].traverse(cb);
  }
}
