export class AnimationHandler {
  obj;
  defaultSize;
  timing = {};

  constructor(obj, defaultSize) {
    this.obj = obj;
    this.defaultSize = defaultSize;
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

  getSize() {
    if (this.timing.size) {
      const { value, percentage } = this.getValueAndPercentage(this.timing.size);

      if (percentage === 1) {
        this.timing.size.resolve();
        delete this.timing.size;
      }

      return Math.round(value);
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
    return this.changeSize(duration, this.defaultSize, 0);
  }

  grow(duration) {
    return this.changeSize(duration, 0, this.defaultSize);
  }

  changeSize(duration, startValue, endValue) {
    if (this.timing.size) this.timing.size.reject();

    return new Promise((resolve, reject) => {
      this.timing.size = { startTime: new Date(), duration, startValue, endValue, resolve, reject };
    });
  }

  getValueAndPercentage({ startTime, duration, startValue, endValue }) {
    const now = new Date();
    const percentage = Math.min((now - startTime) / duration, 1);
    const value = (endValue - startValue) * percentage + startValue;
    return { percentage, value };
  }
}
