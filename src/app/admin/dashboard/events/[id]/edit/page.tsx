"use client";

import { use, useEffect, useState } from "react";
import { EventForm } from "@/components/admin/event-form";
import type { Event } from "@/types";

export default function EditEventPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/events/${params.id}`)
      .then(async (res) => {
        if (!res.ok) return null;
        // The admin events/[id] route returns the raw DB row, we need to fetch via the public API
        // to get the reconstructed Event type
        const allEvents = await fetch("/api/admin/events").then((r) =>
          r.json(),
        );
        const found = allEvents.find(
          (e: Event) => e.id === parseInt(params.id),
        );
        return found || null;
      })
      .then((data) => setEvent(data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!event) {
    return <p className="text-gray-500">Etkinlik bulunamadi.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Etkinlik Duzenle: {event.name}
      </h1>
      <EventForm initialData={event} />
    </div>
  );
}
