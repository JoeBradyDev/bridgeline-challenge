import { NextResponse } from "next/server";
import { extractText } from "unpdf";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const uint8 = new Uint8Array(await file.arrayBuffer());
  const result = await extractText(uint8);

  console.log(result.text.join("\n"));

  return NextResponse.json({
    totalPages: result.totalPages,
    text: result.text.join("\n"),
  });
}
