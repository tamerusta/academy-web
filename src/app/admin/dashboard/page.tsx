"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Event } from "@/types";

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/events")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a: Event, b: Event) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setEvents(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Etkinlikler</h1>
        <button
          onClick={() => router.push("/admin/dashboard/events/new")}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + Yeni Etkinlik
        </button>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
          >
            <div>
              <h3 className="font-medium text-gray-900">{event.name}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span>
                  {new Date(event.date).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span>{event.location.name}</span>
                {event.navigable !== false && (
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                    navigable
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() =>
                router.push(`/admin/dashboard/events/${event.id}/edit`)
              }
              className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1 rounded border border-gray-200 hover:border-gray-300 transition-colors"
            >
              Duzenle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
