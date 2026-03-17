"use client";

import { EventForm } from "@/components/admin/event-form";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Yeni Etkinlik Olustur
      </h1>
      <EventForm />
    </div>
  );
}
