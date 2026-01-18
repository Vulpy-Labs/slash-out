interface InputComponent {
  [key: string]: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  dash: boolean;
  sword: boolean;
  gun: boolean;
}

export type { InputComponent };
