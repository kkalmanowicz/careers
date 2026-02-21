import { NextResponse } from "next/server";
import { agentCard } from "@/lib/structured-data";

export async function GET() {
  return NextResponse.json(agentCard(), {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
