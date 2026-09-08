"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import logo from "public/logo.png";

// The catering menu, exposed inline on the page (the source PDF stays available
// as a download). Content mirrors southern-jerks-catering-menu.pdf exactly - if
// the menu changes, update it here AND the PDF in /public.
type MenuItem = { name: string; qty?: string; price: number };
const MENU: { title: string; note?: string; items: MenuItem[] }[] = [
  {
    title: "Chicken",
    note: "Each meal comes with 20 rolls and 20 jalapeños",
    items: [
      { name: "Half Wings", qty: "50 pieces", price: 75 },
      { name: "Half Wings", qty: "100 pieces", price: 150 },
      { name: "Chicken Tenders", qty: "25 pieces", price: 65 },
      { name: "Chicken Tenders", qty: "50 pieces", price: 105 },
    ],
  },
  {
    title: "Sides",
    items: [
      { name: "Pan Collard Greens", price: 45 },
      { name: "Pan 3 Cheese Mac & Cheese", price: 65 },
      { name: "Pan Jerk Dirty Rice", price: 55 },
      { name: "Box of Seasoned Fries", price: 35 },
    ],
  },
  {
    title: "Extras",
    items: [
      { name: "20 Rolls", price: 10 },
      { name: "20 Jalapeños", price: 10 },
    ],
  },
];

function downloadPdf() {
  const link = document.createElement("a");
  link.href = "/southern-jerks-catering-menu.pdf";
  link.download = "Southern-Jerks-Catering-Menu.pdf";
  link.click();
}

export default function CateringMenuDisplay() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative overflow-hidden rounded-3xl bg-stone-950 p-6 sm:p-10 shadow-2xl ring-1 ring-white/10"
    >
      {/* Signature repeated-logo pattern, echoing the catering hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url(${logo.src})`,
          backgroundRepeat: "repeat",
          backgroundSize: "90px 90px",
          transform: "rotate(-8deg) scale(1.2)",
        }}
      />
      {/* warm brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
      />

      <div className="relative">
        <motion.div variants={rise} className="mb-8 flex items-center justify-center gap-3 text-center">
          <span className="h-px w-8 bg-brand/60" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand">By the tray, feeds a crowd</p>
          <span className="h-px w-8 bg-brand/60" />
        </motion.div>

        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {MENU.map((section) => (
            <motion.div
              key={section.title}
              variants={rise}
              className={section.title === "Chicken" ? "md:col-span-2" : ""}
            >
              <div className="mb-1 flex items-baseline gap-3">
                <h3 className="font-serif text-2xl font-bold text-brand sm:text-3xl">{section.title}</h3>
                <span className="h-px flex-1 translate-y-[-2px] bg-white/15" />
              </div>
              {section.note && (
                <p className="mb-4 text-sm italic text-white/50">{section.note}</p>
              )}

              <ul className={section.title === "Chicken" ? "grid gap-x-12 gap-y-3 sm:grid-cols-2" : "space-y-3"}>
                {section.items.map((item, i) => (
                  <li key={`${item.name}-${i}`} className="flex items-baseline gap-3">
                    <span className="text-[17px] font-medium text-white">
                      {item.name}
                      {item.qty && <span className="ml-2 text-sm font-normal text-white/50">{item.qty}</span>}
                    </span>
                    <span className="mb-1 flex-1 border-b border-dotted border-white/20" />
                    <span className="text-lg font-bold tabular-nums text-brand">${item.price}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={rise}
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row"
        >
          <p className="text-sm text-white/45">Tax and gratuity not included. Custom orders welcome.</p>
          <button
            type="button"
            onClick={downloadPdf}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-brand hover:text-brand"
          >
            <Image src={logo} alt="" width={18} height={18} className="h-4 w-4 rounded-sm" />
            Download PDF menu
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
