import { getAllEvents } from "@/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
  const events = await getAllEvents();
  return NextResponse.json(events);
}
