export class Mode {
    name: string;
    maxCol: number;
    maxRow: number;
    size: number;

    constructor({name,maxCol,maxRow}:{name:string, maxCol:number, maxRow:number}){
        this.name = name;
        this.maxCol = maxCol;
        this.maxRow = maxRow;
        this.size = maxCol * maxRow;
    }
}

export enum ModeType {
    DEFAULT,
    HARD
}

const WORDLE_LEN = 5;
export const MODE : {[key in ModeType]:Mode} = {
    [ModeType.DEFAULT] : new Mode({
        name:'Normal',
        maxCol: WORDLE_LEN,
        maxRow: 6,
    }),
    [ModeType.HARD] : new Mode({
        name:'Hard',
        maxCol: WORDLE_LEN,
        maxRow: 4,
    }),
}