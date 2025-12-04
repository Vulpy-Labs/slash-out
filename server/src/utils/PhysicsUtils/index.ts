type getCenterPositionFromTopLeftProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class PhysicsUtils {
  constructor() {}

  static getCenterPositionFromTopLeft({ x, y, width, height }: getCenterPositionFromTopLeftProps) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    return {
      centerX,
      centerY,
    };
  }
}
