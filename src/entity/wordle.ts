import { MODE, ModeType, Mode } from "./enum/modeType";
import { Word } from "./word";

export class WordleItem extends Word {
  isActiveRow: boolean;
  isActiveWord: boolean;

  constructor(index?: string | undefined){
    super(index);
    this.isActiveRow = false;
    this.isActiveWord = false;
  }

  
  cloneResult(item:WordleItem) {
    super.cloneResult(item);
    this.isActiveRow = item.isActiveRow;
    this.isActiveWord = item.isActiveWord;

    return this;
  }

  toInAcitve() {
    this.isActiveRow = false;
    this.isActiveWord = false;
  }
}

export namespace Wordle {
  export type WordleObjType = {
    wordleArr: WordleItem[];
    currentPosition: number;
    modeType:ModeType;
  };

  export function buildWordleArr(modeType:ModeType = ModeType.DEFAULT) {
    const mode = MODE[modeType];
    return Array(mode.size)
      .fill(new WordleItem())
      .map((_, index) => {
        const item = new WordleItem(index.toString());
        if(index==0){
          item.isActiveWord = true;
        }

        if(index>=_getStartIndex(0,mode) && index<_getEndIndex(0,mode)){
          item.isActiveRow = true;
        }

        return item;
      });
  }

  export function getDefaultWordle(): WordleObjType {
    return {
      wordleArr: buildWordleArr(),
      currentPosition: 0,
      modeType:ModeType.DEFAULT
    };
  }

  function _getCurrentGuessRow(currentPosition: number, mode:Mode): number {
    return Math.trunc(currentPosition / mode.maxCol);
  }
  export function getCurrentGuessRow(currentPosition: number, modeType:ModeType): number {
    return _getCurrentGuessRow(currentPosition , MODE[modeType]);
  }

  // current Start Position (includsive)
  function _getStartIndex(currentPosition: number, mode:Mode): number {
    return mode.maxCol * _getCurrentGuessRow(currentPosition,mode);
  }
  export function getStartIndex(currentPosition: number, modeType:ModeType): number {
    return _getStartIndex(currentPosition,MODE[modeType]);
  }

  // current End Position (excludsive)
  function _getEndIndex(currentPosition: number, mode:Mode): number {
    return mode.maxCol * _getCurrentGuessRow(currentPosition,mode) + mode.maxCol;
  }
  export function getEndIndex(currentPosition: number, modeType:ModeType): number {
    return _getEndIndex(currentPosition,MODE[modeType]);
  }

  export function getCurrentWord(wordle: WordleObjType): string {
    const mode = MODE[wordle.modeType];
    return wordle.wordleArr
      .slice(
        _getStartIndex(wordle.currentPosition,mode),
        _getEndIndex(wordle.currentPosition,mode)
      )
      .map((item) => item.text)
      .join('');
  }

  export function isHasNextAttempt(currentPosition: number, modeType:ModeType): boolean {
    return currentPosition < MODE[modeType].size - 1; // currentGuessRow < WORDLE_MAX_GUESS_NO - 1
  }

  export function isStartOfNewRow(wordle: WordleObjType): boolean {
    return (
      wordle.currentPosition === _getStartIndex(wordle.currentPosition, MODE[wordle.modeType]) &&
      wordle.wordleArr[wordle.currentPosition].text === ""
    );
  }
}
