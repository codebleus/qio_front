export class Quat extends Float32Array {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super(4);
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = w;
  }

  copy(q) {
    this[0] = q[0];
    this[1] = q[1];
    this[2] = q[2];
    this[3] = q[3];
    return this;
  }
}
