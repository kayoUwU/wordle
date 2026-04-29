import { NextRequest, NextResponse } from "next/server";

export function blockDirectBrowserAccess(req: NextRequest) {
  const apiKey = req.headers.get("X-App-Internal");
  // Block direct browser access
  if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json(
      { error: "Direct access forbidden" },
      { status: 403 },
    );
  }
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