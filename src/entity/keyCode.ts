import { Word } from "./word";

export const DEFAULT_KEY = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
  ["Backspace", "Enter", "F5"],
];

export class KeyCode extends Word {
  hidden: boolean;

  constructor(hidden?: boolean) {
    super();
    this.hidden = hidden || false;
  }

  cloneResult(item: KeyCode) {
    super.cloneResult(item);
    this.hidden = item.hidden;

    return this;
  }

  cloneWordle(item: Word) {
    super.cloneResult(item);

    return this;
  }
}

export namespace Keybroad {
  export type DataType = { [key: string]: KeyCode };

  export function buildKeyObject() {
    const keyObj: DataType = {};
    DEFAULT_KEY.forEach((row) => {
      row.forEach((item) => {
        keyObj[item] = new KeyCode();
        if(item==='F5') {
          keyObj[item].hidden = true;
        }
      });
    });
    return keyObj;
  }
}
