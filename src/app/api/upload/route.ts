import { NextResponse } from "next/server";
import { extractText } from "unpdf";
import ai from "@/lib/ai";

export const runtime = "nodejs";

type ProposalInfo = {
  company?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  scope?: string;
  description?: string;
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const uint8 = new Uint8Array(await file.arrayBuffer());
  const result = await extractText(uint8);

  const pdfText = result.text.join("\n");

  let proposal: ProposalInfo;
  let aiResponse: string = "";
  try {
    aiResponse = await ai.prompt(`
Extract biller information from the following text.

Return ONLY valid JSON.
Do NOT wrap the JSON in markdown.
Do NOT include fields with null values.
Do NOT include explanations.
Use proper capitalization instead of all caps.

Allowed fields:
- company (biller company name)
- contactName (biller contact name)
- email (biller email)
- phone (biller phone)
- address (biller address)
- scope (trade/type of work inferred from context of text using title case)
- description (description of work)

TEXT:
${pdfText}
`);

    console.log(aiResponse);
    proposal = JSON.parse(aiResponse);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal processing error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ proposal });
}
