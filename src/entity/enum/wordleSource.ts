import * as GetWordleReqFuncs from "@/lib/getWordleReqFuncs";

export class WordleSource {
  name: string;
  displayName: string;
  isDisableDate: boolean;
  getWordleReqFunc: GetWordleReqFuncs.GetWordleReqFuncType;

  constructor({
    name,
    displayName,
    isDisableDate,
    getWordleReqFunc,
  }: {
    name: string;
    displayName: string;
    isDisableDate: boolean;
    getWordleReqFunc: GetWordleReqFuncs.GetWordleReqFuncType;
  }) {
    this.name = name;
    this.displayName = displayName;
    this.isDisableDate = isDisableDate;
    this.getWordleReqFunc = getWordleReqFunc;
  }
}

// menu by order
export enum WordleSourceType {
  DEMO,
  WORDLE_HINTS_LATEST,
  WORDLE_HINTS, //history of ny
  NY, //no docs
}

export const DEFAULT_WORDLER_SOURCE_TYPE = WordleSourceType.DEMO; //limit api call cost 

export const WORDLE_SOURCE: { [key in WordleSourceType]: WordleSource } = {
  [WordleSourceType.DEMO]: new WordleSource({
    name: "demo",
    displayName: "Demo",
    isDisableDate: false,
    getWordleReqFunc: GetWordleReqFuncs.getDemoWordByDate,
  }),
  [WordleSourceType.WORDLE_HINTS_LATEST]: new WordleSource({
    name: "default",
    displayName: "Wordle Hints Latest",
    isDisableDate: true,
    getWordleReqFunc: GetWordleReqFuncs.getWordleHintsWordLatest,
  }),
  [WordleSourceType.WORDLE_HINTS]: new WordleSource({
    name: "wordle_hints",
    displayName: "Wordle Hints",
    isDisableDate: false,
    getWordleReqFunc: GetWordleReqFuncs.getWordleHintsWordByDate,
  }),
  [WordleSourceType.NY]: new WordleSource({
    name: "nytimes",
    displayName: "New York Times",
    isDisableDate: false,
    getWordleReqFunc: GetWordleReqFuncs.getNYTimeWordByDate,
  }),
};
