import { NextRequest, NextResponse } from "next/server";
import { dateStringToDate } from "./utils";
import {
  NY_TIMES_OLDEST_DATE,
  WORDLE_HINT_OLDEST_DATE,
  BASE_PATH,
} from "./constant";

// result: param=xx%param2=xx
export function objToSearchParams(params: Object): string {
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
export function checkWordleHintsDateRange(dateStr: string): boolean {
  const oldestDay = dateStringToDate(WORDLE_HINT_OLDEST_DATE);

  const twoDaysBefore = new Date();
  twoDaysBefore.setHours(0, 0, 0, 0);
  twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

  const reqDate = dateStringToDate(dateStr);

  if (reqDate >= twoDaysBefore || reqDate < oldestDay) {
    return false;
  }

  return true;
}

// no result for 	"2021-06-19" < day > today
export function checkNYTimesDateRange(dateStr: string): boolean {
  const oldestDay = dateStringToDate(NY_TIMES_OLDEST_DATE);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reqDate = dateStringToDate(dateStr);

  if (reqDate > today || reqDate < oldestDay) {
    return false;
  }

  return true;
}

const _BASE_PATH = BASE_PATH===''?'':`${BASE_PATH}/`;
export async function jsonApiReqBase(
  endpoint: string,
  options: RequestInit = {},
) {
  let defaultHeaders: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    // Send the key injected during the build process
    "X-App-Internal": process.env.NEXT_PUBLIC_BROWSER_API_KEY || "",
  };

  const response = await fetch(`${_BASE_PATH}${endpoint}`, {
    method: "GET",
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "API Error" }));
    throw new Error(error.message || "API unsuccessful");
  }

  return response.json();
}