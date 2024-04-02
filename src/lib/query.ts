import { Result } from "@/entity/result";

const api = "https://wordle-apis.vercel.app/api/validate";

export async function dummyValidateReq(word: string) {
  return new Result({
    isvalidword: word === "valid" ? false : true,
    score: word === "score" ? [2, 2, 2, 2, 2] : [0, 1, 2, 0, 1, 2],
  });
}

export async function validateReq(word: string) {
  try {
    const res = await fetch(api, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guess: word,
      }),
    });
    const json = await res.json();
    return new Result({
      isvalidword: json?.is_valid_word || false,
      score: json?.score || [],
    });
  } catch (err) {
    console.warn("validateReq error", err);
    throw err;
  }
}
