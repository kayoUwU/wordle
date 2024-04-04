import { ResultType } from "./enum/resultType";

export class Result {
  isvalidword: boolean;
  score: ResultType.Status[];

  constructor({
    isvalidword,
    score,
  }: {
    isvalidword: boolean;
    score: number[];
  }) {
    this.isvalidword = isvalidword;
    if (score.length) {
      this.score = score.map((item) => ResultType.fromOrdinal(item));
    } else {
      this.score = [];
    }
  }
}
