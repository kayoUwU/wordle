
import { PARTY3RD_REQUEST_URL, REQ_TYPES , RES_TYPES} from "@/lib/apiUrl"

const getNYCDailyWord = async (req: REQ_TYPES.GetNYCDailyWordReq) : Promise<RES_TYPES.NycWordResType> => {
  console.log("getNYCDailyWord date",req.date);
  const date = req.date;
  const url = `${PARTY3RD_REQUEST_URL.nycWordleApi}/${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2,'0')}.json`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const json = await res.json() as RES_TYPES.NycWordResType;
    console.log(`NYCDailyWord ${json.solution}`);
    return json;
  } catch (err) {
    console.warn("wordCheckReq error", err);
    throw err;
  }
};

//TODO cahce?
export async function POST(req: Request) {
  try {
     // Parse the request body
    const proxyReqBody = await req.json();
    const res = await getNYCDailyWord({date:new Date(proxyReqBody.date)}); //String to Date

    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: `proxy error ${error}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}