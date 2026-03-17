import { getAnnouncement } from "@/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
  const announcement = await getAnnouncement();
  return NextResponse.json(announcement);
}
