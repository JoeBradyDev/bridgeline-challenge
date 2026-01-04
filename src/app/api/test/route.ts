import { NextResponse } from "next/server";
import supabase from "@/db/supabaseClient";

export async function GET() {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
