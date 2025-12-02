import { Bodies } from 'matter-js';
import Matter = require('matter-js');

type createRectangleBodyFromTopLeftProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  options?: Matter.IChamferableBodyDefinition;
};

type getTopLeftFromCenteredBodyProps = {
  body: Matter.Body;
};

type getCenterPositionFromTopLeftProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class PhysicsUtils {
  constructor() {}

  static createRectangleBodyFromTopLeft({
    x,
    y,
    width,
    height,
    options = {},
  }: createRectangleBodyFromTopLeftProps): Matter.Body {
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    return Bodies.rectangle(centerX, centerY, width, height, options);
  }

  static getTopLeftFromCenteredBody({ body }: getTopLeftFromCenteredBodyProps) {
    const positionY = body.position.y;
    const positionX = body.position.x;
    const minPositionY = body.bounds.min.y;
    const minPositionX = body.bounds.min.x;

    const offsetY = positionY - minPositionY;
    const offsetX = positionX - minPositionX;

    const top = positionY - offsetY;
    const left = positionX - offsetX;

    return { x: left, y: top };
  }

  static getCenterPositionFromTopLeft({ x, y, width, height }: getCenterPositionFromTopLeftProps) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    return {
      centerX,
      centerY,
    };
  }
}
