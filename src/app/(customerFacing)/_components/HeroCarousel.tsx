"use client";
// Auto-rotating hero: each slide swaps its background image, headline,
// subheadline and CTA together. Background images crossfade; the text trio
// enters staggered; a thin per-slide progress bar fills over the dwell. Reuses
// the exact motion/AnimatePresence/useReducedMotion pattern (and easing) from
// components/LoadingScreen.tsx for visual consistency. Client component because
// it owns the timer, hover/focus pause, and shared active-slide state — imported
// into the server-rendered TopSection in HomeSections.tsx.

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Button } from "@/components/ui/button";
import LogoDriftBackground from "./LogoDriftBackground";
import { SITE_CONFIG } from "@/lib/siteConfig";
import Logo from "@/../public/general/logo/logo.png";

export type HeroSlide = {
  image: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
};

const INTERVAL = 6000; // dwell per slide, kept in sync with the CSS progress bar
const EASE = [0.22, 1, 0.36, 1] as const; // matches LoadingScreen entrance easing

export default function HeroCarousel({
  slides,
  logoUrl,
  subTagline,
}: {
  slides: HeroSlide[];
  logoUrl?: string;
  subTagline: string;
}) {
  const reduce = useReducedMotion();
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Pausable 6s auto-advance. `remaining` banks the leftover time on pause so a
  // hover/focus resumes from where it left off, staying in step with the CSS
  // progress bar (which pauses via animation-play-state). Reduced motion does NOT
  // shorten the dwell — only the visual transitions collapse (framer durations
  // below + the global prefers-reduced-motion rule that flattens the bar).
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt = useRef(0);
  const remaining = useRef(INTERVAL);

  const go = useCallback(
    (next: number) => {
      setActive(((next % count) + count) % count);
      remaining.current = INTERVAL; // any move (auto or manual) restarts the clock
    },
    [count],
  );

  // (Re)schedule the advance whenever the slide changes or we un-pause.
  useEffect(() => {
    if (count <= 1 || paused) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(() => go(active + 1), remaining.current);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active, paused, count, go]);

  const pause = useCallback(() => {
    if (paused || count <= 1) return;
    if (timer.current) clearTimeout(timer.current);
    remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
    setPaused(true);
  }, [paused, count]);

  const resume = useCallback(() => {
    if (count <= 1) return;
    setPaused(false);
  }, [count]);

  if (count === 0) return null;
  const slide = slides[active];

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
    exit: { opacity: 0, transition: { duration: reduce ? 0 : 0.2 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.001 : 0.35, ease: EASE } },
    exit: { opacity: 0, transition: { duration: reduce ? 0 : 0.2 } },
  };

  return (
    <div
      className="flex relative overflow-hidden h-svh w-full sm:w-[85%] flex-col sm:flex-row bg-stone-100 sm:rounded-3xl sm:p-2"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${SITE_CONFIG.name} highlights`}
    >
      <LogoDriftBackground veilClassName="bg-background/90" className="sm:rounded-3xl" />

      {/* Text column (Phase 0 layout preserved). subTagline is a constant kicker
          under the logo; the rotating trio (headline / subheadline / CTA) sits
          below it, keyed by the active slide. */}
      <div className="sm:relative absolute z-30 bottom-20 sm:bottom-auto flex flex-col gap-6 items-start h-full sm:justify-center justify-end pt-10 md:pb-20 md:w-1/2 p-5 md:p-12">
        <Image
          alt={`${SITE_CONFIG.name} logo`}
          src={logoUrl || Logo}
          width={120}
          height={120}
          className="h-28 w-28 rounded-full object-cover shadow-lg"
        />

        <span className="font-semibold text-white sm:text-muted-foreground text-md">
          {subTagline}
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col gap-6 items-start"
          >
            <motion.h1
              variants={item}
              className="text-brand lg:text-5xl text-4xl font-bold leading-10 lg:leading-15"
            >
              {slide.headline}
            </motion.h1>
            <motion.p
              variants={item}
              className="text-white sm:text-foreground lg:text-4xl text-3xl font-bold leading-9 lg:leading-12"
            >
              {slide.subheadline}
            </motion.p>
            <motion.div variants={item}>
              <Link href={slide.ctaHref}>
                <Button size="lg" variant="mainButton">
                  {slide.ctaLabel}
                  <MdKeyboardArrowRight />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Controls: prev/next + one filling segment per slide (segment doubles
            as the clickable dot). Only shown when there's more than one slide. */}
        {count > 1 && (
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous slide"
              className="grid place-items-center size-8 rounded-full text-white sm:text-foreground bg-white/15 sm:bg-foreground/10 hover:bg-white/30 sm:hover:bg-foreground/20 transition-colors"
            >
              <MdKeyboardArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}: ${s.headline}`}
                  aria-current={i === active}
                  className="relative h-1.5 w-9 rounded-full overflow-hidden bg-white/30 sm:bg-foreground/20"
                >
                  <span
                    key={i === active ? active : `done-${i}`}
                    className="absolute inset-0 origin-left rounded-full bg-brand"
                    style={
                      i < active
                        ? { transform: "scaleX(1)" }
                        : i > active
                          ? { transform: "scaleX(0)" }
                          : {
                              transform: "scaleX(0)",
                              animation: `heroProgress ${INTERVAL}ms linear forwards`,
                              animationPlayState: paused ? "paused" : "running",
                            }
                    }
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next slide"
              className="grid place-items-center size-8 rounded-full text-white sm:text-foreground bg-white/15 sm:bg-foreground/10 hover:bg-white/30 sm:hover:bg-foreground/20 transition-colors"
            >
              <MdKeyboardArrowRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Image column: crossfading stack + persistent mobile readability gradient. */}
      <div className="relative z-10 w-full md:w-1/2 sm:rounded-3xl overflow-hidden h-svh sm:h-full">
        <AnimatePresence mode="sync">
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: "easeInOut" }}
          >
            <Image
              priority
              fill
              alt={`${SITE_CONFIG.name} — ${slide.headline}`}
              src={slide.image}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover sm:brightness-100 brightness-[0.4]"
            />
          </motion.div>
        </AnimatePresence>
        <div className="sm:hidden absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent z-20" />
      </div>
    </div>
  );
}
