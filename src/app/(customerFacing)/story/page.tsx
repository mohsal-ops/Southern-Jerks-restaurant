"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import pic2 from "@/../public/general/generalPages/partners.jpg";
import pic3 from "@/../public/general/generalPages/grandmother.jpg";
import pic4 from "@/../public/general/generalPages/enjoy.jpg";

import jabrilPhoto from "@/../public/general/generalPages/jabril.jpg"
import jordanPhoto from "@/../public/general/generalPages/jordan.jpg";

const partners = [
  {
    name: "Jabril Riddick",
    role: "Partner & CCO",
    initials: "JR",
    photo: jabrilPhoto,
    bio: [
      "Jabril Riddick is a seasoned culinary professional with over 15 years of hands-on experience in the food industry. His journey from line cook to Executive Chef is a testament to his dedication, passion, and unmatched work ethic — giving him a rare, ground-level understanding of every aspect of restaurant operations.",
      "Jabril's expertise spans every position in the industry, providing him with an invaluable perspective on how a kitchen should run efficiently and with the highest standards. Throughout his career he has played a key role in opening several restaurants — crafting menus, organizing front and back of house operations, and building the right teams from the ground up.",
      "As Partner and Chief Culinary Officer, Jabril brings the kind of culinary artistry and operational leadership that not only elevates the dining experience, but ensures the business is built to thrive.",
    ],
    accent: "#c85a1e",
  },
  {
    name: "Jordan Riddick",
    role: "Partner & CEO",
    initials: "JR",
    photo: jordanPhoto,
    bio: [
      "Jordan Riddick is a seasoned financial and accounting professional with over 15 years of experience helping businesses strengthen their financial foundation and drive sustainable growth. With deep expertise in Gross Profit, EBITDA, financial statement preparation, budgeting, and forecasting, Jordan brings a comprehensive and strategic approach to every organization he works with.",
      "Throughout his career Jordan has proven himself as more than just a numbers expert — he is a results-driven leader who understands the bigger picture. He has successfully guided companies through rebuilding accounting departments, led new software implementations, and introduced strategic cost-cutting measures that simultaneously fuel expansion and long-term growth.",
      "As Owner and CEO, Jordan combines extensive technical knowledge with a forward-thinking mindset, making him a trusted partner for businesses looking to optimize their operations and position themselves for lasting success.",
    ],
    accent: "#1a6b3c",
  },
];

export default function Page() {
  return (
    <main className="flex flex-col items-center pt-24 overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative w-full h-[90vh] flex items-end justify-start">
        <Image
          src={pic2}
          alt="Southern Jerks story hero"
          fill
          priority
          className="object-cover brightness-[0.45]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl px-8 md:px-16 pb-20 md:pb-28 text-white"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-sm font-semibold tracking-widest uppercase text-yellow-400 mb-4"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Where Family,<br />
            <span className="text-yellow-400">Flavor</span> &amp; Culture Meet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.35 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed"
          >
            Some of life's greatest gifts are the things you love most —
            and for the owners of Southern Jerks, that's food and family.
          </motion.p>
        </motion.div>
      </section>

      {/* ── ORIGIN STATEMENT ── */}
      <section className="w-full max-w-6xl px-6 md:px-12 py-24 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-6 "
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-[#c85a1e]">
            How It Started
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-snug">
            Born from a grandmother's kitchen
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Southern Jerks was born from a passion for sharing authentic,
            heartfelt cuisine with the world — bringing together Caribbean-style
            recipes with a distinct Houston flair.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            At the heart of Southern Jerks is a rich family legacy. Owners
            Jabril and Jordan Riddick were raised on the flavors of their
            grandmother's Caribbean kitchen, where cherished recipes and
            culinary secrets were passed down with love — from savory patties
            to iconic Caribbean Jerk Chicken and a host of other bold,
            vibrant flavors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="h-full"
        >
          <Image
            src={pic3}
            alt="The Southern Jerks experience"
            className="rounded-3xl object-top w-full h-full  aspect-4/3"
          />
        </motion.div>
      </section>

            {/* ── MEET THE OWNERS ── */}
      <section className="w-full text-lg font-semibold  bg-stone-50 py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-[#c85a1e] mb-3">
              The People Behind It
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">Meet the owners</h2>
          </motion.div>

          <div className="flex flex-col gap-20">
            {partners.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`flex flex-col ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-12 items-start`}
              >
                {/* Photo / Avatar placeholder */}
                <div className="relative shrink-0 w-full md:w-72">
                    <Image src={person.photo} alt={person.name}  className="object-cover flex items-center justify-center aspect-3/4 rounded-3xl" />

                  <div className="mt-5 px-1">
                    <p className="text-lg font-bold">{person.name}</p>
                    <p
                      className="text-sm font-medium mt-0.5"
                      style={{ color: person.accent }}
                    >
                      {person.role}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex-1 space-y-5 pt-2">
                  {person.bio.map((para, j) => (
                    <p key={j} className="text-gray-600 leading-relaxed text-[15px]">
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section className="w-full bg-stone-900 text-white py-20 px-6 text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-2xl md:text-4xl font-bold leading-snug">
            "Southern Jerks is more than a restaurant —
            <span className="text-yellow-400"> it's an experience."</span>
          </p>
          <p className="mt-6 text-gray-400 text-lg leading-relaxed">
            Blending the authenticity of traditional Caribbean dishes with
            the warmth of home-style cooking, Southern Jerks brings a
            one-of-a-kind fusion of flavor to the Houston market.
          </p>
        </motion.blockquote>
      </section>

      {/* ── VALUES ── */}
      <section className="w-full max-w-6xl px-6 md:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-[#c85a1e] mb-3">
            What We Stand For
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            The soul behind the flavor
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: "🏡",
              title: "Family First",
              text: "Every recipe carries the legacy of family. We cook the way our grandmother cooked — with love, intention, and nothing to hide.",
            },
            {
              icon: "🌶️",
              title: "Bold Authenticity",
              text: "No shortcuts, no compromises. Caribbean flavors done right, every single time — because Houston deserves the real thing.",
            },
            {
              icon: "🤝",
              title: "Community Rooted",
              text: "We're not just serving food. We're building a space where culture, community, and connection share the same table.",
            },
          ].map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.12 }}
              className="bg-white border border-stone-200 rounded-2xl p-8 space-y-3"
            >
              <span className="text-3xl">{v.icon}</span>
              <h3 className="text-xl font-semibold">{v.title}</h3>
              <p className="text-gray-500 leading-relaxed">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CLOSING IMAGE + CTA ── */}
      <section className="w-full max-w-6xl px-6 md:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden"
        >
          <Image
            src={pic4}
            alt="Southern Jerks dining experience"
            className="w-full object-cover max-h-125"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-10 md:p-16 text-white max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              This Is Just the Beginning
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Houston's appetite for genuine Caribbean flavor is wide open —
              and Southern Jerks is here to fill it, one unforgettable
              plate at a time.
            </p>
            <a
              href="/Menu"
              className="inline-flex items-center gap-2 bg-yellow-400 text-stone-900 font-semibold px-7 py-3 rounded-xl hover:bg-yellow-300 transition-colors text-sm"
            >
              View our menu
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </motion.div>
      </section>

    </main>
  );
}