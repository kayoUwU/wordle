import { PARTY3RD_REQUEST_URL } from "@/lib/apiUrl";
import { REQ_TYPES, RES_TYPES } from "@/entity/api/wordleAnswer";
import { NextRequest, NextResponse } from "next/server";
import { GetNYTimesDailyWordSearchParams } from "@/entity/api/wordleAnswer/apiReq";
import { checkNYTimesDateRange } from "@/lib/apiUtils";
import { validateDateStringFormat } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { blockDirectAccess } from "@/lib/server/serverUtils";

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
      cache: 'force-cache',
      next: { tags: ['nytimes-by-date',`nytimes-date-${req.dateStr}`] } 
    });

    const json = await res.json();
    console.log(`getNYCDailyWord res solution: ${json.solution}, `, json);
    if (json.status && json.status === "ERROR") {
      revalidateTag(`nytimes-date-${req.dateStr}`);
      return undefined;
    }
    return json as RES_TYPES.NyTimesWordRes;
  } catch (err) {
    console.error("getNYCDailyWord error", err);
    throw err;
  }
};

// cahce https://nextjs.org/docs/app/guides/caching-without-cache-components
export async function GET(req: NextRequest) {
  try {
    const direct = blockDirectAccess(req);
    if(!direct.isValid){
      return direct.response;
    }

    // Parse the request 
    const { searchParams } = req.nextUrl;

    const dateStr = searchParams.get(GetNYTimesDailyWordSearchParams.dateStr);
    if(dateStr === undefined || dateStr === null){
      return NextResponse.json({ error: 'missing params: dateStr' }, {status: 400})
    }

    // Validate date format (YYYY-MM-DD)
    if (!validateDateStringFormat(dateStr)) {
      return NextResponse.json({ error: 'Invalid dateStr format' }, { status: 400 });
    }

    if(!checkNYTimesDateRange(dateStr)){
      return NextResponse.json({ error: 'no solution found' }, {status: 404});
    }
      

    // Proxy the request to the real external API
    const res = await getNYCDailyWord({ dateStr });

    if (res === undefined) {
      return NextResponse.json({ error: 'no solution found' }, {status: 404})
    }

    //headers: { "Content-Type": "application/json" }
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control#immutable
    return NextResponse.json(res,{status: 200,
      headers: {
        'Cache-Control': 'Cache-Control: public, max-age=604800, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: `proxy error ${error}` }, {status: 500})
  }
}
