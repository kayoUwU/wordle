import { WordleSourceType } from "./enum/wordleSource";

export class WordleSourceFields {
  wordleSourceType: WordleSourceType;
  wordleDate: string; //YYYY-MM-DD
  // wordLength: number; //MODE[modeType].maxCol

  constructor(wordleSourceType: WordleSourceType, wordleDate: string){
    this.wordleSourceType = wordleSourceType;
    this.wordleDate = wordleDate;
  }

  // update specific fields
  copy(updates: Partial<WordleSourceFields>): WordleSourceFields {
    const newObj = new WordleSourceFields(this.wordleSourceType,this.wordleDate);
    return Object.assign(newObj, updates);
  }
};