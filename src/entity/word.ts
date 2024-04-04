import { ResultType } from "./enum/resultType";

export class Word implements Style {
  key?: string | undefined;
  text: string;
  result: ResultType.Status;
  css?: React.CSSProperties | undefined;
  className?: string | undefined;

  constructor(index?: string | undefined) {
    this.key = index;
    this.text = "";
    this.result = ResultType.Status.NONE;
    this.className = "";
  }

  cloneResult(item:Word) {
    this.key = item.key;
    this.text = item.text;
    this.result = item.result;

    return this;
  }

  get style() {
    if (this.css) {
      return { ...ResultType.toStyle(this.result), ...this.css };
    }
    return ResultType.toStyle(this.result);
  }
}
