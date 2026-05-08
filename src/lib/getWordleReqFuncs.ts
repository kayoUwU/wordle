import { REQUEST_URL } from "@/lib/apiUrl";
import { REQ_TYPES, RES_TYPES } from "@/entity/api/wordleAnswer";
import { DEMO_WORD_LIST } from "@/lib/constant";
import { dateStringToDate, validateDateStringFormat } from "@/lib/utils";
import { checkNYTimesDateRange, checkWordleHintsDateRange, objToSearchParams } from "./apiUtils";

export type GetWordleReqFuncType = (
  dateStr: string,
) => Promise<string | undefined>;

// undefined when error
export const getNYTimeWordByDate: GetWordleReqFuncType = async (
  dateStr: string,
): Promise<string | undefined> => {
  if (!validateDateStringFormat(dateStr)) {
    return undefined;
  }
  
  if(!checkNYTimesDateRange(dateStr)){
    return undefined;
  }
  
  const params: REQ_TYPES.GetNYTimesDailyWordReq = { dateStr };
  const query = objToSearchParams(params);

  // cross origin use Proxy
  const res = await fetch(`${REQUEST_URL.nytimesWordleApi}?${query}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Send the key injected during the CI/CD build process
      'X-App-Internal': process.env.NEXT_PUBLIC_API_KEY || ''
    },
  });

  const json = await res.json();
  console.log("getNYTimeWordByDate %s res: ", dateStr, json);

  if (json.error) {
    return undefined;
  }
  return (json as RES_TYPES.NyTimesWordRes).solution;
};

 // result for day = (today - 2days)
export const getWordleHintsWordLatest: GetWordleReqFuncType = async (
  _: string,
): Promise<string | undefined> => {
  const params : REQ_TYPES.GetWordleHintsReq = {isLatest: true, dateStr:undefined};
  const query = objToSearchParams(params);

  // cross origin use Proxy
  const res = await fetch(`${REQUEST_URL.wordlehintsApi}?${query}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Send the key injected during the CI/CD build process
      'X-App-Internal': process.env.NEXT_PUBLIC_API_KEY || ''
    },
  });

  const json = (await res.json()) as RES_TYPES.wordlerHintsResultItem;
  console.log("getWordleHintsWordLatest res: ", json);

  if (json.error) {
    return undefined;
  }


  return json.answer;
};

// undefined = no result
export const getWordleHintsWordByDate: GetWordleReqFuncType = async (
  dateStr: string,
): Promise<string | undefined> => {
  if (!validateDateStringFormat(dateStr)) {
    return undefined;
  }

  if(!checkWordleHintsDateRange(dateStr)){
    return undefined;
  }

  const params : REQ_TYPES.GetWordleHintsReq = {isLatest: false, dateStr};
  const query = objToSearchParams(params);

  // cross origin use Proxy
  const res = await fetch(`${REQUEST_URL.wordlehintsApi}?${query}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Send the key injected during the CI/CD build process
      'X-App-Internal': process.env.NEXT_PUBLIC_API_KEY || ''
    },
  });

  const json = (await res.json()) as RES_TYPES.WordleHintsRes;
  console.log("getWordleHintsWordByDate %s res: ", dateStr, json);

  //update may not be today
  if (json.error || json.total == 0) {
    return undefined;
  }

  return json.results[0].answer;
};

// 7 Days soultion
export const getDemoWordByDate: GetWordleReqFuncType = (
  dateStr: string,
): Promise<string | undefined> => {
  if (!validateDateStringFormat(dateStr)) {
    return Promise.resolve(undefined);
  }

  const day = dateStringToDate(dateStr).getUTCDay();

  return Promise.resolve(DEMO_WORD_LIST[day]);
};
