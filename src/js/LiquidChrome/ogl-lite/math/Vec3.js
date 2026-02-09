export class Vec3 extends Float32Array {
  constructor(x = 0, y = 0, z = 0) {
    super(3);
    this[0] = x;
    this[1] = y;
    this[2] = z;
  }

  set(x, y, z) {
    this[0] = x;
    this[1] = y;
    this[2] = z;
    return this;
  }

  copy(v) {
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    return this;
  }
}
