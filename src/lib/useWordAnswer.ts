import { useEffect, useState } from "react";
import { getDailyWord } from "./query";

import { ResultType } from "@/entity/enum/resultType";
import { Result } from "@/entity/result";
import { dictionaryCheckReq } from "./query";

export async function dummyValidateReq(input: string, wordLength: number) {
  console.log("DEV:", input);
  return new Result({
    isvalidword: input.toUpperCase() === "VALID" ? false : true,
    score:
      input.toUpperCase() === "SCORE"
        ? Array(wordLength).fill(ResultType.Status.CORRET)
        : [
            ResultType.Status.WRONG,
            ResultType.Status.WRONG_POSITION,
            ResultType.Status.CORRET,
            ResultType.Status.WRONG,
            ResultType.Status.WRONG_POSITION,
          ],
  });
}

export function useWordAnswer(wordLength: number) {
  const [wordSolutionChars, setWordolutionChars] = useState<string[] | null>(
    null,
  ); //TODO　:by date
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const now = new Date();
      console.log("now",now);
      const res = await getDailyWord(now);
      console.log("Solution %s", res);
      if(res){
        setWordolutionChars(res.toUpperCase().split(""));
      }
      setIsLoading(false);
    })();
  },[]);

  const validateAnswer = async (input: string, isDev: boolean = false) => {
    if (isDev) {
      return dummyValidateReq(input, wordLength);
    }

    if(!wordSolutionChars){
      //TODO show no solution
      throw new Error("no solution");
    }

    const score = Array(wordLength).fill(ResultType.Status.WRONG);
    try {
      //assume wordSolutionChars.length = input.length = wordLength
      const isValid = await dictionaryCheckReq(input);
      if (!isValid) {
        return new Result({
          isvalidword: false,
          score,
        });
      }

      const inputChars = input.split("");
      const compareChars = [...wordSolutionChars];

      //compare char by char
      inputChars.forEach((char, i) => {
        console.log(char," char i ",compareChars[i])
        if (char === compareChars[i]) {
          score[i] = ResultType.Status.CORRET;
          compareChars[i] = ""; //each char use once
        }
      });

      //check if remaining char exists
      inputChars.forEach((char, i) => {
        if (score[i] == ResultType.Status.CORRET) return;

        const index = compareChars.indexOf(char);
        if (index !== -1) {
          score[i] = ResultType.Status.WRONG_POSITION;
          compareChars[index] = ""; //each char use once
        }
      });

      return new Result({
        isvalidword: true,
        score,
      });
    } catch (err) {
      console.warn("validateReq error", err);
      throw err;
    }
  };

  return {
    isLoading,
    validateAnswer,
  };
}
