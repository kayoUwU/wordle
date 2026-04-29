import { useEffect, useState } from "react";
import { getDailyWord } from "./query";

import { ResultType } from "@/entity/enum/resultType";
import { Result } from "@/entity/result";
import { dictionaryCheckReq } from "./query";
import { WordleSourceFields } from "@/entity/WordleSourceFields";
import { WORDLE_LEN } from "@/lib/constant";

export async function dummyValidateReq(input: string) {
  console.log("DEV:", input);
  return new Result({
    isvalidword: input.toUpperCase() === "VALID" ? false : true,
    score:
      input.toUpperCase() === "SCORE"
        ? Array(WORDLE_LEN).fill(ResultType.Status.CORRET)
        : [
            ResultType.Status.WRONG,
            ResultType.Status.WRONG_POSITION,
            ResultType.Status.CORRET,
            ResultType.Status.WRONG,
            ResultType.Status.WRONG_POSITION,
          ],
  });
}

export function useWordAnswer(prop:WordleSourceFields) {
  const [wordSolutionChars, setWordolutionChars] = useState<string[] | null>(
    null,
  ); 
  const [isLoading, setIsLoading] = useState(true);

  // load answer
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      console.log("req prop.wordleDate %s, prop.wordleSourceType %s",prop.wordleDate, prop.wordleSourceType);
      const res = await getDailyWord(new WordleSourceFields(prop.wordleSourceType, prop.wordleDate));
      console.log("Solution %s", res);
      if(res !== undefined){
        setWordolutionChars(res.toUpperCase().split(""));
      } else {
        setWordolutionChars(null);
      }
      setIsLoading(false);
    })();
  },[prop.wordleDate, prop.wordleSourceType]);

  const validateAnswer = async (input: string, isDev: boolean = false) => {
    if (isDev) {
      return dummyValidateReq(input);
    }

    if(!wordSolutionChars){
      throw new Error("no solution");
    }

    const score = Array(wordSolutionChars.length).fill(ResultType.Status.WRONG);
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
      console.error("validateReq error", err);
      throw err;
    }
  };

  return {
    wordSolutionChars,
    isLoading,
    validateAnswer,
  };
}
