import { Word } from "./word";

const WORDLE_LEN = 5;
const WORDLE_MAX_GUESS_NO = 6;
const WORLDE_ARRAY_SIZE = WORDLE_LEN * WORDLE_MAX_GUESS_NO;

export class WordleItem extends Word {
  isActiveRow: boolean;
  private _isActiveWord: boolean;

  constructor(index?: string | undefined){
    super(index);
    this.isActiveRow = false;
    this._isActiveWord = false;
  }

  
  cloneResult(item:WordleItem) {
    super.cloneResult(item);
    this.isActiveRow = item.isActiveRow;
    this._isActiveWord = item._isActiveWord;

    return this;
  }

  toInAcitve() {
    this.isActiveRow = false;
    this._isActiveWord = false;
  }

  get isActiveWord(): boolean {
    return this._isActiveWord;
  }

  set isActiveWord(isActive : boolean) {
    this.isActiveRow = isActive;
    this._isActiveWord = isActive;
  }
}

export namespace Wordle {
  export type WordleObjType = {
    wordleArr: WordleItem[];
    currentPosition: number;
  };

  export function buildWordleArr() {
    return Array(WORLDE_ARRAY_SIZE)
      .fill(new WordleItem())
      .map((_, index) => {
        const item = new WordleItem(index.toString());
        if(index==0){
          item.isActiveWord = true;
        }

        if(index>=getStartIndex(0) && index<getEndIndex(0)){
          item.isActiveRow = true;
        }

        return item;
      });
  }

  export function getDefaultWordle(): WordleObjType {
    return {
      wordleArr: buildWordleArr(),
      currentPosition: 0,
    };
  }

  export function getCurrentGuessRow(currentPosition: number): number {
    return Math.trunc(currentPosition / WORDLE_LEN);
  }

  // current Start Position (includsive)
  export function getStartIndex(currentPosition: number): number {
    return WORDLE_LEN * getCurrentGuessRow(currentPosition);
  }

  // current End Position (excludsive)
  export function getEndIndex(currentPosition: number): number {
    return WORDLE_LEN * getCurrentGuessRow(currentPosition) + WORDLE_LEN;
  }

  export function getCurrentWord(wordle: WordleObjType): string {
    return wordle.wordleArr
      .slice(
        getStartIndex(wordle.currentPosition),
        getEndIndex(wordle.currentPosition)
      )
      .map((item) => item.text)
      .join('');
  }

  export function isHasNextAttempt(currentPosition: number): boolean {
    return currentPosition < WORLDE_ARRAY_SIZE - 1; // currentGuessRow < WORDLE_MAX_GUESS_NO - 1
  }

  export function isStartOfNewRow(wordle: WordleObjType): boolean {
    return (
      wordle.currentPosition === getStartIndex(wordle.currentPosition) &&
      wordle.wordleArr[wordle.currentPosition].text === ""
    );
  }
}
