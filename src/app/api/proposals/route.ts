import { NextResponse } from "next/server";
import supabase from "@/db/supabaseClient";

export const GET = async () => {
  try {
    const { data: proposals, error } = await supabase
      .from("proposals")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(proposals);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
