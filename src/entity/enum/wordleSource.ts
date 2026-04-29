import * as GetWordleReqFuncs from "@/lib/getWordleReqFuncs";

export class WordleSource {
    name: string;
    displayName: string;
    isDisableDate: boolean;
    getWordleReqFunc: GetWordleReqFuncs.GetWordleReqFuncType;

    constructor({name, displayName, isDisableDate, getWordleReqFunc}:{name:string, displayName:string, isDisableDate:boolean, getWordleReqFunc: GetWordleReqFuncs.GetWordleReqFuncType}){
        this.name = name;
        this.displayName = displayName;
        this.isDisableDate = isDisableDate;
        this.getWordleReqFunc = getWordleReqFunc;
    }
}

export enum WordleSourceType {
    DEFAULT,
    WORDLE_HINTS, //history of ny
    NY, //no docs
    DEMO,
}


export const WORDLE_SOURCE : {[key in WordleSourceType]:WordleSource} = {
    [WordleSourceType.DEFAULT] : new WordleSource({
        name: 'default',
        displayName: 'Wordle Hints Latest',
        isDisableDate:true,
        getWordleReqFunc: GetWordleReqFuncs.getWordleHintsWordLatest
    }),
    [WordleSourceType.WORDLE_HINTS] : new WordleSource({
        name: 'wordle_hints',
        displayName: 'Wordle Hints',
        isDisableDate:false,
        getWordleReqFunc: GetWordleReqFuncs.getWordleHintsWordByDate
    }),
    [WordleSourceType.NY] : new WordleSource({
        name: 'nytimes',
        displayName: 'New York Times',
        isDisableDate:false,
        getWordleReqFunc: GetWordleReqFuncs.getNYTimeWordByDate
    }),
    [WordleSourceType.DEMO] : new WordleSource({
        name: 'demo',
        displayName: 'demo',
        isDisableDate:false,
        getWordleReqFunc: GetWordleReqFuncs.getDemoWordByDate
    }),
}