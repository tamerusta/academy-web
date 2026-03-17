"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Event } from "@/types";

type EventColorContextType = {
  currentEvent: Event | null;
  setCurrentEvent: (event: Event) => void;
};

const EventColorContext = createContext<EventColorContextType>({
  currentEvent: null,
  setCurrentEvent: () => {},
});

const notFoundColors = {
  primary: "348 83% 47%",
  secondary: "348 83% 47%",
  accent: "348 83% 47%",
  background: "0 0% 6%",
  text: "0 0% 100%",
};

export const EventColorProvider = ({
  children,
  events = [],
}: {
  children: ReactNode;
  events?: Event[];
}) => {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(
    events[0] ?? null,
  );
  const pathname = usePathname();

  // Update default event when events load
  React.useEffect(() => {
    if (events.length > 0 && !currentEvent) {
      setCurrentEvent(events[0]);
    }
  }, [events, currentEvent]);

  React.useEffect(() => {
    const isNotFound = pathname === "/404" || pathname === "/not-found";

    const palette = isNotFound ? notFoundColors : currentEvent?.colorPalette;

    if (palette) {
      document.documentElement.style.setProperty(
        "--color-primary",
        palette.primary,
      );
      document.documentElement.style.setProperty(
        "--color-secondary",
        palette.secondary,
      );
      document.documentElement.style.setProperty(
        "--color-accent",
        palette.accent,
      );
      document.documentElement.style.setProperty(
        "--color-background",
        palette.background,
      );
      document.documentElement.style.setProperty("--color-text", palette.text);
    }
  }, [currentEvent, pathname]);

  return (
    <EventColorContext.Provider value={{ currentEvent, setCurrentEvent }}>
      {children}
    </EventColorContext.Provider>
  );
};

export const useEventColor = () => useContext(EventColorContext);
