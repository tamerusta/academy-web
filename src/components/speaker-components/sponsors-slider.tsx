"use client";

import type { Sponsor } from "@/types";
import { useEffect, useRef, useState } from "react";
import { eventImageUrl } from "@/lib/image-url";
import Image from "next/image";

const SponsorSlider = ({
  sponsors,
  eventSlug,
  reverse = false,
  speed = 1,
}: {
  sponsors: Sponsor[];
  eventSlug: string;
  reverse?: boolean;
  speed?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner || sponsors.length === 0) return;

    const timer = setTimeout(() => {
      setInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [sponsors]);

  useEffect(() => {
    if (!initialized) return;

    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner || sponsors.length === 0) return;

    const items = Array.from(inner.querySelectorAll(".sponsor-item"));
    if (items.length === 0) return;

    const totalWidth = items.slice(0, sponsors.length).reduce((sum, item) => {
      const style = window.getComputedStyle(item);
      const marginLeft = Number.parseFloat(style.marginLeft || "0");
      const marginRight = Number.parseFloat(style.marginRight || "0");
      return (
        sum + item.getBoundingClientRect().width + marginLeft + marginRight
      );
    }, 0);

    let position = 0;

    const animate = () => {
      position += reverse ? speed : -speed;

      if (!reverse && position <= -totalWidth) {
        position += totalWidth;
      } else if (reverse && position >= totalWidth) {
        position -= totalWidth;
      }

      inner.style.transform = `translateX(${position}px)`;

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [sponsors, reverse, speed, initialized]);

  const duplicatedSponsors = [
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
  ];

  return (
    <div className="w-full flex justify-center bg-color-background overflow-hidden">
      <div className="w-2/3 relative">
        <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-color-background to-transparent z-10"></div>

        <div ref={containerRef} className="relative h-40 overflow-hidden">
          <div
            ref={innerRef}
            className="flex items-center absolute h-full"
            style={{ willChange: "transform" }}
          >
            {duplicatedSponsors.map((sponsor, index) => (
              <div
                key={`${sponsor.sponsorSlug}-${index}`}
                className="mx-8 flex-shrink-0 sponsor-item"
              >
                <Image
                  src={eventImageUrl(
                    eventSlug,
                    "sponsors",
                    `${sponsor.sponsorSlug}.webp`,
                  )}
                  alt={`${sponsor.sponsorSlug} logo`}
                  width={160}
                  height={56}
                  className="object-contain opacity-80 filter transition-all duration-200 ease-in-out grayscale brightness-[15%] contrast-[100%] hover:opacity-100 hover:grayscale-0 hover:brightness-110 hover:contrast-100"
                  draggable={false}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-color-background to-transparent z-10"></div>
      </div>
    </div>
  );
};

export default SponsorSlider;
