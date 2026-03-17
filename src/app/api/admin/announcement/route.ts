import { NextResponse } from "next/server";
import { validateAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/db/index";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request) {
  const valid = await validateAdminSession(request);
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const db = await getDb();

  // Get existing announcement
  const existing = await db.select().from(schema.announcements).limit(1);

  if (existing[0]) {
    await db
      .update(schema.announcements)
      .set({
        show: body.show,
        text: body.text,
        backgroundColor: body.backgroundColor,
        textColor: body.textColor,
        link: body.link || null,
        linkText: body.linkText || null,
        showLink: body.showLink,
      })
      .where(eq(schema.announcements.id, existing[0].id));
  } else {
    await db.insert(schema.announcements).values({
      show: body.show,
      text: body.text,
      backgroundColor: body.backgroundColor,
      textColor: body.textColor,
      link: body.link || null,
      linkText: body.linkText || null,
      showLink: body.showLink,
    });
  }

  return NextResponse.json({ success: true });
}
