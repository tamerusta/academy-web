"use client";

import { use, useEffect, useState } from "react";
import type { Event } from "@/types";
import { notFound } from "next/navigation";
import { useEventColor } from "@/context/EventColorContext";
import EventPage from "@/components/event-page/EventPage";
import Loading from "@/app/loading";

export default function DynamicEventPage({
  params: paramsPromise,
}: {
  params: Promise<{ eventName: string }>;
}) {
  const params = use(paramsPromise);
  const { setCurrentEvent } = useEventColor();
  const [eventDetails, setEventDetails] = useState<Event | null | undefined>(
    undefined,
  );

  useEffect(() => {
    fetch(`/api/events/${params.eventName}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data: Event | null) => {
        setEventDetails(data);
        if (data) setCurrentEvent(data);
      })
      .catch(() => setEventDetails(null));
  }, [params.eventName]);

  if (eventDetails === undefined) return <Loading />;

  if (!eventDetails || eventDetails.navigable === false) {
    notFound();
  }

  return <EventPage event={eventDetails} hero={false} />;
}
