import { NextResponse } from "next/server";
import supabase from "@/db/supabaseClient";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();

  const company = formData.get("company")?.toString();
  const contactName = formData.get("contactName")?.toString();
  const email = formData.get("email")?.toString();
  const phone = formData.get("phone")?.toString();
  const address = formData.get("address")?.toString();
  const scope = formData.get("scope")?.toString();
  const description = formData.get("description")?.toString();

  if (!company) {
    return NextResponse.json({ error: "Company is required" }, { status: 400 });
  }

  try {
    const { error } = await supabase.from("proposals").insert({
      company,
      contact_name: contactName,
      email,
      phone,
      address,
      scope,
      description,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save proposal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
