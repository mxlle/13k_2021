import { Text } from 'kontra';

export class Marker {
  obj;
  parent;

  constructor(symbol, parent, isBottom) {
    const markerSize = parent.defaultSize / 2.5;
    const font = `${markerSize}px sans-serif`;
    const margin = markerSize / 3;
    let position;

    if (isBottom) {
      position = {
        x: -(parent.defaultSize / 2 + margin),
        y: parent.defaultSize / 2 - markerSize + margin,
      };
    } else {
      position = {
        x: parent.defaultSize / 2 - markerSize + margin,
        y: -(parent.defaultSize / 2 + margin),
      };
    }

    this.obj = new Text({ text: symbol, font, ...position });
    this.parent = parent;
  }

  hide() {
    this.parent.obj.removeChild(this.obj);
  }

  show() {
    if (!this.parent.obj.children.includes(this.obj)) {
      this.parent.obj.addChild(this.obj);
    }
  }
}
