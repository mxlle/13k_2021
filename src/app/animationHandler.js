export class AnimationHandler {
  obj;
  timing = {};

  constructor(obj) {
    this.obj = obj;
  }

  getRotation() {
    if (this.timing.spin) {
      const { value, percentage } = this.getValueAndPercentage(this.timing.spin);

      if (percentage === 1) {
        this.timing.spin.resolve();
        delete this.timing.spin;
      }

      return value;
    } else {
      return null;
    }
  }

  getScale() {
    if (this.timing.scale) {
      const { value, percentage } = this.getValueAndPercentage(this.timing.scale);

      if (percentage === 1) {
        this.timing.scale.resolve();
        delete this.timing.scale;
      }

      return value;
    } else {
      return null;
    }
  }

  spinAround(duration, direction, turns) {
    const startValue = 0;
    const endValue = direction * turns * 2 * Math.PI;

    if (this.timing.spin) this.timing.spin.reject();

    return new Promise((resolve, reject) => {
      this.timing.spin = { startTime: new Date(), duration, startValue, endValue, resolve, reject };
    });
  }

  shrink(duration) {
    return this.changeScale(duration, 1, 0);
  }

  grow(duration) {
    return this.changeScale(duration, 0, 1);
  }

  changeScale(duration, startValue, endValue) {
    if (this.timing.scale) this.timing.scale.reject();

    return new Promise((resolve, reject) => {
      this.timing.scale = { startTime: new Date(), duration, startValue, endValue, resolve, reject };
    });
  }

  getValueAndPercentage({ startTime, duration, startValue, endValue }) {
    const now = new Date();
    const percentage = Math.min((now - startTime) / duration, 1);
    const value = (endValue - startValue) * percentage + startValue;
    return { percentage, value };
  }
}
