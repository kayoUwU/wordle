import { RES_TYPES } from "@/entity/api/wordleAnswer";
import { GetWordleHintsSearchParams } from "@/entity/api/wordleAnswer/apiReq";
import { PARTY3RD_REQUEST_URL } from "@/lib/apiUrl";
import { blockDirectBrowserAccess } from "@/lib/apiUtils";
import { validateDateStringFormat } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const getWordleHintsWordLatest = async (
): Promise<RES_TYPES.wordlerHintsResultItem | undefined> => {
  const res = await fetch(PARTY3RD_REQUEST_URL.wordlehintsLatestApi, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const json = (await res.json()) as RES_TYPES.wordlerHintsResultItem;
  console.log("getWordleHintsWordLatest res: ", json);
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
  });

  const json = (await res.json()) as RES_TYPES.WordleHintsRes;
  console.log("getWordleHintsWordByDate %s res: ", dateStr, json);

  //update may not be today
  if (json.total == 0) {
    return undefined;
  }

  return json;
};

export async function GET(req: NextRequest) {
  try {
    blockDirectBrowserAccess(req);

    // Parse the request 
    const { searchParams } = req.nextUrl;

    if(!searchParams.has(GetWordleHintsSearchParams.isLatest)|| 
    (searchParams.get(GetWordleHintsSearchParams.isLatest)!=='true' && searchParams.get(GetWordleHintsSearchParams.isLatest)!=='false')){
      return NextResponse.json({ error: 'missing params: isLatest' }, {status: 200})
    }
    const isLatest = searchParams.get(GetWordleHintsSearchParams.isLatest) === 'true';
    const dateStr = searchParams.get(GetWordleHintsSearchParams.dateStr);
    //const getWordleHintsReq: GetWordleHintsReq = {isLatest,dateStr};


    let res: RES_TYPES.wordlerHintsResultItem | RES_TYPES.WordleHintsRes | undefined = undefined;

    if(isLatest){
      // Proxy the request to the real external API
      res = await getWordleHintsWordLatest();
    } else {
      if(dateStr === undefined || dateStr === null){
        return NextResponse.json({ error: 'missing params: dateStr' }, {status: 200})
      }

      if (!validateDateStringFormat(dateStr)) {
        return NextResponse.json({ error: 'Invalid dateStr format' }, { status: 400 });
      }

      // Proxy the request to the real external API
      res = await getWordleHintsWordByDate(dateStr); //String to Date
    }

    if (res === undefined) {
      return NextResponse.json({ error: 'no solution found' }, {status: 200})
    }

    //headers: { "Content-Type": "application/json" }
    return NextResponse.json(res,{status: 200});
  } catch (error) {
    return NextResponse.json({ error: `proxy error ${error}` }, {status: 500})
  }
}