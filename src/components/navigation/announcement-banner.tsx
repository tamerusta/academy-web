"use client";

import { useEffect, useRef, useState } from "react";

type AnnouncementData = {
  show: boolean;
  text: string;
  backgroundColor: string;
  textColor: string;
  link?: string | null;
  linkText?: string | null;
  showLink: boolean;
};

export const AnnouncementBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(
    null,
  );

  useEffect(() => {
    fetch("/api/announcement")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.show) {
          setAnnouncement(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!announcement?.show) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const setupAnimation = () => {
      const scrollContent = scrollContainer.querySelector(
        ".scroll-content",
      ) as HTMLElement;
      if (!scrollContent) return;

      const contentWidth = scrollContent.offsetWidth;
      const duration = contentWidth * 0.005;

      scrollContent.style.animationDuration = `${duration}s`;
    };

    setupAnimation();

    window.addEventListener("resize", setupAnimation);
    return () => window.removeEventListener("resize", setupAnimation);
  }, [announcement]);

  if (!announcement?.show) return null;

  return (
    <div
      className="w-full py-3 overflow-hidden"
      style={{
        backgroundColor: announcement.backgroundColor,
        color: announcement.textColor,
      }}
      ref={scrollRef}
    >
      <div className="scroll-container relative">
        <div className="scroll-content whitespace-nowrap inline-block animate-scroll">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="inline-block px-8">
              {announcement.text}
              {announcement.showLink && announcement.link && (
                <a
                  href={announcement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 underline hover:no-underline"
                >
                  {announcement.linkText || "Daha fazla"}
                </a>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
