import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Receiver } from "@upstash/qstash";

export async function POST(req: NextRequest) {
  // Verify QStash signature
  const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!currentSigningKey || !nextSigningKey) {
    return NextResponse.json({ error: "QStash keys not configured" }, { status: 500 });
  }

  const receiver = new Receiver({
    currentSigningKey,
    nextSigningKey,
  });

  const body = await req.text();

  let isValid = false;
  try {
    isValid = await receiver.verify({
      signature: req.headers.get("upstash-signature") ?? "",
      body,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (!isValid) {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });
  }

  // Revalidate all paths
  revalidatePath("/", "layout");
  revalidatePath("/llms.txt");
  revalidatePath("/llms-full.txt");

  console.log(`[refresh] Triggered at ${new Date().toISOString()}`);

  return NextResponse.json({
    success: true,
    refreshedAt: new Date().toISOString(),
    message: "Revalidated all paths",
  });
}

// Also allow manual trigger in development (without signature check)
export async function GET(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    return NextResponse.json({ error: "GET not allowed in production" }, { status: 405 });
  }

  revalidatePath("/", "layout");

  return NextResponse.json({
    success: true,
    refreshedAt: new Date().toISOString(),
    message: "Development revalidation triggered",
  });
}
