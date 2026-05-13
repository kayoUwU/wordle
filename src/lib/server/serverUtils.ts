import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function blockDirectAccess(req: NextRequest) {
  const fetchSite = req.headers.get("sec-fetch-site"); //from browser
  // Block if the request is NOT from your own site
  if (fetchSite !== "same-origin") {
    return {
      isValid: false,
      response: NextResponse.json("External Access Forbidden", { status: 403 }),
    };
  }

  const headerList = headers();
  const host = headerList.get("host"); // .vercel.app
  const referer = headerList.get("referer"); // Where the request came from

  // If there is no referer (like a direct curl command)
  // or the referer doesn't match your host, block it.
  if (!referer || !referer.includes(host as string)) {
    return {
      isValid: false,
      response: NextResponse.json(
        { error: "External access forbidden" },
        { status: 403 },
      ),
    };
  }

  const apiKey = req.headers.get("X-App-Internal");
  // Block direct browser access
  if (apiKey !== process.env.NEXT_PUBLIC_BROWSER_API_KEY) {
    return {
      isValid: false,
      response: NextResponse.json(
        { error: "Direct access forbidden" },
        { status: 403 },
      ),
    };
  }
  return {
    isValid: true,
  };
}
