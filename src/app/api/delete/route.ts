import { NextResponse } from "next/server";
import supabase from "@/db/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const ids: number[] = body.ids;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No proposal IDs provided" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("proposals").delete().in("id", ids);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete proposals" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, deletedIds: ids });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
