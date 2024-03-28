import { ResultType } from "./enum/resultType";

export class Word {
    text: string;
    result: ResultType.Status;

    constructor() {
        this.text='';
        this.result=ResultType.Status.NONE;
    }

    clone(item : Word) {
        this.text = item.text;
        this.result = item.result;
    }

    get style() {
        return ResultType.toStyle(this.result);
    }
}