import { WORDLE_LEN } from "@/lib/constant";

export class Mode {
    name: string;
    maxCol: number;
    maxRow: number;
    size: number;
    resultStyle: React.CSSProperties;

    constructor({name,maxCol,maxRow,resultStyle}:{name:string, maxCol:number, maxRow:number,resultStyle: React.CSSProperties}){
        this.name = name;
        this.maxCol = maxCol;
        this.maxRow = maxRow;
        this.size = maxCol * maxRow;
        this.resultStyle = resultStyle;
    }
}

export enum ModeType {
    DEFAULT,
    HARD
}

export const MODE : {[key in ModeType]:Mode} = {
    [ModeType.DEFAULT] : new Mode({
        name:'Normal',
        maxCol: WORDLE_LEN,
        maxRow: 6,
        resultStyle: {backgroundColor:'var(--green-color)'},
    }),
    [ModeType.HARD] : new Mode({
        name:'Hard',
        maxCol: WORDLE_LEN,
        maxRow: 4,
        resultStyle: {backgroundColor:'var(--red-color)'},
    }),
}