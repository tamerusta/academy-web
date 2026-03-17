"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navigation/navbar";
import { EventColorProvider } from "@/context/EventColorContext";
import Footer from "@/components/navigation/footer";
import { getLatestEventLink } from "@/lib/event-utils";
import type { Event } from "@/types";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [latestEventLink, setLatestEventLink] = useState(
    "https://togather.lodos.io/communities/multiacademy-94761667282726876508",
  );

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data: Event[]) => {
        setEvents(data);
        setLatestEventLink(getLatestEventLink(data));
      })
      .catch(() => {});
  }, []);

  return (
    <EventColorProvider events={events}>
      <Navbar eventLink={latestEventLink} />
      {children}
      <Footer />
    </EventColorProvider>
  );
}
