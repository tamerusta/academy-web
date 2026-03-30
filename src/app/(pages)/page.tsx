"use client";

import {
  getSecondLatestEvent,
  getLatestNavigableEvent,
} from "@/lib/event-utils";
import { useEffect, useState, useMemo } from "react";
import { useEventColor } from "@/context/EventColorContext";
import EventPage from "@/components/event-page/EventPage";
import Loading from "@/app/loading";
import type { Event } from "@/types";

export default function HeroPage() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const { setCurrentEvent } = useEventColor();

  useEffect(() => {
    // Save scroll position before refresh
    const handleBeforeUnload = () => {
      sessionStorage.setItem("scrollPos", window.scrollY.toString());
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    fetch("/api/events")
      .then((res) => res.json())
      .then((data: Event[]) => {
        setEvents(data);
        // Restore scroll position after data loads
        const savedPos = sessionStorage.getItem("scrollPos");
        if (savedPos) {
          setTimeout(() => {
            window.scrollTo({
              top: parseInt(savedPos),
              behavior: "instant" as ScrollBehavior,
            });
            sessionStorage.removeItem("scrollPos");
          }, 100);
        }
      })
      .catch(() => setEvents([]));

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const latestEventDetails = useMemo(
    () => (events ? getLatestNavigableEvent(events) : null),
    [events],
  );

  const secondLatest = useMemo(
    () =>
      events && events.length >= 2 ? getSecondLatestEvent(events) : undefined,
    [events],
  );

  useEffect(() => {
    if (latestEventDetails) {
      setCurrentEvent(latestEventDetails);
    }
  }, [latestEventDetails, setCurrentEvent]);

  return (
    <>
      {!events && <Loading />}
      {events && (
        <>
          {latestEventDetails ? (
            <EventPage
              event={latestEventDetails}
              previousEvent={secondLatest}
              hero
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
              <p>Etkinlik bulunamadı.</p>
            </div>
          )}
        </>
      )}
    </>
  );
}
