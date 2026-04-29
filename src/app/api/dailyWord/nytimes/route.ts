import { PARTY3RD_REQUEST_URL } from "@/lib/apiUrl";
import { REQ_TYPES, RES_TYPES } from "@/entity/api/wordleAnswer";
import { NextRequest, NextResponse } from "next/server";
import { GetNYTimesDailyWordSearchParams } from "@/entity/api/wordleAnswer/apiReq";
import { blockDirectBrowserAccess } from "@/lib/apiUtils";
import { validateDateStringFormat } from "@/lib/utils";

// undefined = no found
const getNYCDailyWord = async (
  req: REQ_TYPES.GetNYTimesDailyWordReq,
): Promise<RES_TYPES.NyTimesWordRes | undefined> => {
  console.log("getNYCDailyWord req date: ", req.dateStr);
  const url = `${PARTY3RD_REQUEST_URL.nytimesWordleApi}/${req.dateStr}.json`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    console.log(`getNYCDailyWord res solution: ${json.solution}, `, json);
    if (json.status && json.status === "ERROR") {
      return undefined;
    }
    return json as RES_TYPES.NyTimesWordRes;
  } catch (err) {
    console.error("getNYCDailyWord error", err);
    throw err;
  }
};

//TODO cahce? https://nextjs.org/docs/app/getting-started/caching#working-with-runtime-apis
export async function GET(req: NextRequest) {
  try {
    blockDirectBrowserAccess(req);

    // Parse the request 
    const { searchParams } = req.nextUrl;

    const dateStr = searchParams.get(GetNYTimesDailyWordSearchParams.dateStr);
    if(dateStr === undefined || dateStr === null){
      return NextResponse.json({ error: 'missing params: dateStr' }, {status: 200})
    }

    // Validate date format (YYYY-MM-DD)
    if (!validateDateStringFormat(dateStr)) {
      return NextResponse.json({ error: 'Invalid dateStr format' }, { status: 400 });
    }

    // Proxy the request to the real external API
    const res = await getNYCDailyWord({ dateStr });

    if (res === undefined) {
      return NextResponse.json({ error: 'no solution found' }, {status: 200})
    }

    //headers: { "Content-Type": "application/json" }
    return NextResponse.json(res,{status: 200});
  } catch (error) {
    return NextResponse.json({ error: `proxy error ${error}` }, {status: 500})
  }
}
