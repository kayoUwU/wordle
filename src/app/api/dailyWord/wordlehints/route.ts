import { RES_TYPES } from "@/entity/api/wordleAnswer";
import { GetWordleHintsSearchParams } from "@/entity/api/wordleAnswer/apiReq";
import { PARTY3RD_REQUEST_URL } from "@/lib/apiUrl";
import { blockDirectBrowserAccess, checkWordleHintsDateRange } from "@/lib/apiUtils";
import { validateDateStringFormat } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const getWordleHintsWordLatest = async (secondsTilNextDay:number
): Promise<RES_TYPES.wordlerHintsResultItem | undefined> => {
  const res = await fetch(PARTY3RD_REQUEST_URL.wordlehintsLatestApi, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    next: { revalidate: secondsTilNextDay } 
  });

  const json = (await res.json()) as RES_TYPES.wordlerHintsResultItem;
  console.log(secondsTilNextDay,"getWordleHintsWordLatest res: ", json);
  return json;
};

// undefined = no result
const getWordleHintsWordByDate = async (
  dateStr: string,
): Promise<RES_TYPES.WordleHintsRes | undefined> => {
  const url = `${PARTY3RD_REQUEST_URL.wordlehintsApi}?date=${dateStr}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: 'force-cache',
    next: { tags: ['wordle-hints-by-date',`wordle-hints-${dateStr}`] } 
  });

  const json = (await res.json()) as RES_TYPES.WordleHintsRes;
  console.log("getWordleHintsWordByDate %s res: ", dateStr, json);

  //update may not be today
  if (json.total == 0) {
    revalidateTag(`wordle-hints-${dateStr}`);
    return undefined;
  }

  return json;
};

export async function GET(req: NextRequest) {
  try {
    if(blockDirectBrowserAccess(req)){
      return NextResponse.json(
        { error: "Direct access forbidden" },
        { status: 403 },
      );
    }

    // Parse the request 
    const { searchParams } = req.nextUrl;

    if(!searchParams.has(GetWordleHintsSearchParams.isLatest)|| 
    (searchParams.get(GetWordleHintsSearchParams.isLatest)!=='true' && searchParams.get(GetWordleHintsSearchParams.isLatest)!=='false')){
      return NextResponse.json({ error: 'missing params: isLatest' }, {status: 200})
    }
    const isLatest = searchParams.get(GetWordleHintsSearchParams.isLatest) === 'true';
    const dateStr = searchParams.get(GetWordleHintsSearchParams.dateStr);
    //const getWordleHintsReq: GetWordleHintsReq = {isLatest,dateStr};

    // for caching time
    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setHours(24, 0, 0, 0); // 12:00 AM tomorrow
    const secondsTilNextDay = Math.floor((nextDay.getTime() - now.getTime()) / 1000);


    let res: RES_TYPES.wordlerHintsResultItem | RES_TYPES.WordleHintsRes | undefined = undefined;

    if(isLatest){
      // Proxy the request to the real external API
      res = await getWordleHintsWordLatest(secondsTilNextDay);
    } else {
      if(dateStr === undefined || dateStr === null){
        return NextResponse.json({ error: 'missing params: dateStr' }, {status: 400})
      }

      if (!validateDateStringFormat(dateStr)) {
        return NextResponse.json({ error: 'Invalid dateStr format' }, { status: 400 });
      }

      if(!checkWordleHintsDateRange(dateStr)){
        return NextResponse.json({ error: 'no solution found' }, { status: 404 });
      }

      // Proxy the request to the real external API
      res = await getWordleHintsWordByDate(dateStr); //String to Date
    }

    if (res === undefined) {
      return NextResponse.json({ error: 'no solution found' }, {status: 404})
    }

    //headers: { "Content-Type": "application/json" }
    const nextResponse = NextResponse.json(res,{status: 200});
    if(isLatest){
      nextResponse.headers.set('Cache-Control', `public, s-maxage=${secondsTilNextDay}, must-revalidate`);
    }
    else {
      nextResponse.headers.set('Cache-Control', 'public, max-age=604800, immutable');
    }
    return nextResponse;
  } catch (error) {
    return NextResponse.json({ error: `proxy error ${error}` }, {status: 500})
  }
}