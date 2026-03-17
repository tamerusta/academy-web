import { NextResponse } from "next/server";
import { validateAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/db/index";
import { getAllEvents } from "@/db/queries";
import * as schema from "@/db/schema";

export async function GET(request: Request) {
  const valid = await validateAdminSession(request);
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await getAllEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const valid = await validateAdminSession(request);
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const db = await getDb();

  // Insert event
  const eventResult = await db
    .insert(schema.events)
    .values({
      navigable: body.navigable ?? true,
      name: body.name,
      heroDescription: body.heroDescription,
      cardDescription: body.cardDescription,
      registerLink: body.registerLink,
      videoUrl: body.videoUrl || null,
      date: body.date,
      locationName: body.location.name,
      locationSubtext: body.location.subtext,
      locationLatitude: body.location.latitude || null,
      locationLongitude: body.location.longitude || null,
      colorPrimary: body.colorPalette.primary,
      colorSecondary: body.colorPalette.secondary,
      colorAccent: body.colorPalette.accent,
      colorBackground: body.colorPalette.background,
      colorText: body.colorPalette.text,
    })
    .returning({ id: schema.events.id });

  const eventId = eventResult[0].id;

  // Batch insert child rows
  if (body.speakers?.length) {
    await db.insert(schema.speakers).values(
      body.speakers.map((s: any, i: number) => ({
        eventId,
        fullName: s.fullName,
        title: s.title,
        company: s.company || null,
        instagram: s.instagram || null,
        linkedin: s.linkedin || null,
        twitter: s.twitter || null,
        sortOrder: i,
      })),
    );
  }

  if (body.organizers?.length) {
    await db.insert(schema.organizers).values(
      body.organizers.map((o: any, i: number) => ({
        eventId,
        name: o.name,
        designation: o.designation,
        image: o.image,
        sortOrder: i,
      })),
    );
  }

  if (body.sessions?.length) {
    await db.insert(schema.sessions).values(
      body.sessions.map((s: any, i: number) => ({
        eventId,
        room: s.room,
        speakerName: s.speakerName,
        topic: s.topic || null,
        startTime: s.startTime || null,
        endTime: s.endTime || null,
        sortOrder: i,
      })),
    );
  }

  if (body.sponsors?.length) {
    await db.insert(schema.sponsors).values(
      body.sponsors.map((s: any, i: number) => ({
        eventId,
        tier: s.tier,
        sponsorSlug: s.sponsorSlug,
        sortOrder: i,
      })),
    );
  }

  if (body.tickets?.length) {
    await db.insert(schema.tickets).values(
      body.tickets.map((t: any, i: number) => ({
        eventId,
        type: t.type,
        description: t.description,
        price: t.price,
        link: t.link,
        perks: JSON.stringify(t.perks),
        sortOrder: i,
      })),
    );
  }

  if (body.images?.length) {
    await db.insert(schema.eventImages).values(
      body.images.map((url: string, i: number) => ({
        eventId,
        url,
        sortOrder: i,
      })),
    );
  }

  if (body.initialMetrics?.length) {
    await db.insert(schema.initialMetrics).values(
      body.initialMetrics.map((m: any, i: number) => ({
        eventId,
        title: m.title,
        value: m.value,
        sortOrder: i,
      })),
    );
  }

  if (body.afterMetrics) {
    await db.insert(schema.afterMetrics).values({
      eventId,
      applications: body.afterMetrics.applications,
      vipGuests: body.afterMetrics.vipGuests,
      supporter: body.afterMetrics.supporter,
      speakers: body.afterMetrics.speakers,
      workingParticipant: body.afterMetrics.workingParticipant,
      jobSeeker: body.afterMetrics.jobSeeker,
      jobProvider: body.afterMetrics.jobProvider,
      satisfaction: body.afterMetrics.satisfaction,
    });
  }

  return NextResponse.json({ id: eventId });
}
