import { NextRequest, NextResponse } from "next/server";
import { dateStringToDate } from "./utils";
import { NY_TIMES_OLDEST_DATE, WORDLE_HINT_OLDEST_DATE } from "./constant";

export function blockDirectBrowserAccess(req: NextRequest) {
  const apiKey = req.headers.get("X-App-Internal");
  // Block direct browser access
  if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return true;
  }
  return false;
}

// result: param=xx%param2=xx
export function objToSearchParams(params:Object):string{
  const searchParams = new URLSearchParams();

  // append values
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString(); 
}

// no result for 	"2021-06-19" < day >= (today - 2days)
export function checkWordleHintsDateRange(dateStr:string): boolean{
  const oldestDay = dateStringToDate(WORDLE_HINT_OLDEST_DATE);

  const twoDaysBefore = new Date();
  twoDaysBefore.setHours(0, 0, 0, 0);
  twoDaysBefore.setDate(twoDaysBefore.getDate()-2);

  const reqDate = dateStringToDate(dateStr);

  if(reqDate>=twoDaysBefore || reqDate<oldestDay){
    return false;
  }

  return true;
}

// no result for 	"2021-06-19" < day > today
export function checkNYTimesDateRange(dateStr:string): boolean {
  const oldestDay = dateStringToDate(NY_TIMES_OLDEST_DATE);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reqDate = dateStringToDate(dateStr);

  if(reqDate>today || reqDate<oldestDay){
    return false;
  }

  return true;
}