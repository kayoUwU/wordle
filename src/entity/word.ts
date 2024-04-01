import { ResultType } from "./enum/resultType";

export class Word {
    key?: string | undefined;
    text: string;
    result: ResultType.Status;
    css?: React.CSSProperties | undefined;
    className: string;

    constructor() {
        this.text='';
        this.result=ResultType.Status.NONE;
        this.className = '';
    }

    clone(item : Word) {
        this.text = item.text;
        this.result = item.result;
    }

    get style() {
        if(this.css){
            return {...ResultType.toStyle(this.result), ...this.css};
        }
        return ResultType.toStyle(this.result);
    }
}