export class PhysicsBody {
  x: number;
  y: number;
  velocityX: number = 0;
  velocityY: number = 0;
  width: number;
  height: number;
  isGrounded: boolean = false;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
