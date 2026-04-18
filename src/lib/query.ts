import { REQUEST_URL , REQ_TYPES , RES_TYPES} from "@/lib/apiUrl"; 

// true if word exist
export async function dictionaryCheckReq(word: string) : Promise<boolean> {
  const url = `${REQUEST_URL.dictionaryApi}/${word.toLowerCase()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const json = await res.json() as RES_TYPES.DictionaryResType;
    if(json?.entries && json?.entries.length > 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.warn("wordCheckReq error", err);
    throw err;
  }
}


export async function getDailyWord(date: Date) : Promise<string> {
  const req : REQ_TYPES.GetNYCDailyWordReq = {date};

  const res = await fetch(REQUEST_URL.nycWordleApi, {
    method: "POST",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    body: JSON.stringify(req)
  });

  const json = await res.json() as RES_TYPES.NycWordResType;
  console.log("res ", json);

  return json.solution;
}

