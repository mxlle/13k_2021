import { Text } from 'kontra';

export class Marker {
  obj;

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
    this.hide();
    parent.obj.children.push(this.obj);
  }

  hide() {
    this.obj.opacity = 0;
  }

  show() {
    this.obj.opacity = 1;
  }
}
