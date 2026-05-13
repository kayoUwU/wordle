import { PARTY3RD_REQUEST_URL } from "@/lib/apiUrl";
import { DictionaryRes } from "@/entity/api/res";
import { WORDLE_SOURCE, WordleSourceType } from "@/entity/enum/wordleSource";
import { WordleSourceFields } from "@/entity/WordleSourceFields";
import { IS_DISABLE_SERVER_API } from "./constant";

// true if word exist
export async function dictionaryCheckReq(word: string): Promise<boolean> {
  const url = `${PARTY3RD_REQUEST_URL.dictionaryApi}/${word.toLowerCase()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const json = (await res.json()) as DictionaryRes;
    if (json?.entries && json?.entries.length > 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.error("wordCheckReq error", err);
    throw err;
  }
}

export async function getDailyWord(
  query: WordleSourceFields,
): Promise<string | undefined> {
  try {
    if (IS_DISABLE_SERVER_API) {
      // just use demo
      if (query.wordleSourceType === WordleSourceType.DEMO) {
        return await WORDLE_SOURCE[WordleSourceType.DEMO].getWordleReqFunc(
          query.wordleDate,
        );
      }
      return undefined;
    }

    const res = await WORDLE_SOURCE[query.wordleSourceType].getWordleReqFunc(
      query.wordleDate,
    );
    return res;
  } catch (err) {
    console.error("getDailyWord error", err);
    return undefined;
  }
}
