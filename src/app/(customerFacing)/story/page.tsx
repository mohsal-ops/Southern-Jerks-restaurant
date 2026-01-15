"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import pic2 from "@/../public/general/partners.jpg";
import pic3 from "@/../public/general/vibe.jpg"; 
import pic4 from "@/../public/general/enjoy.jpg"; 

export default function Page() {
  console.log("🔥 NEW STORY PAGE LOADED", Date.now());

  return (
    <main className="flex flex-col items-center pt-24 space-y-24">

      {/* HERO */}
      <section className="relative w-full h-[85vh] flex items-center justify-center text-center">
        <Image
          src={pic2}
          alt="Our story hero"
          fill
          priority
          className="object-cover brightness-50"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl px-6 text-white"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            What started as a passion for culture, music, and people
            turned into unforgettable experiences across the U.S.
          </p>
        </motion.div>
      </section>

      {/* INTRO */}
      <section className="max-w-5xl px-6 text-center space-y-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold"
        >
          Built From the Streets, Powered by Community
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gray-600 text-lg leading-relaxed"
        >
          We didn’t start with big budgets or big stages.  
          We started with people, culture, and the belief that
          real moments create real connections.
        </motion.p>
      </section>

      {/* IMAGE + TEXT */}
      <section className="grid md:grid-cols-2 gap-12 max-w-6xl px-6 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={pic3}
            alt="Early days"
            className="rounded-3xl object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <h3 className="text-2xl font-semibold">
            From Local Events to Iconic Celebrations
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Our journey took us from small community gatherings
            to some of the most recognized parades and festivals
            in the United States.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every event taught us something new about people,
            visibility, and how brands truly connect.
          </p>
        </motion.div>
      </section>

      {/* TIMELINE */}
      <section className="max-w-4xl px-6 w-full">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Journey
        </h2>

        <div className="space-y-10 border-l-2 border-gray-200 pl-8">
          {[
            {
              year: "2018",
              text: "First community-driven events and grassroots activations.",
            },
            {
              year: "2020",
              text: "Expansion into larger festivals and cultural parades.",
            },
            {
              year: "2023",
              text: "Trusted partner for brands seeking real-world visibility.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <span className="absolute -left-9.5 top-1 w-4 h-4 bg-yellow-400 rounded-full" />
              <h4 className="font-semibold text-lg">{item.year}</h4>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-gray-50 w-full py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">What We Stand For</h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                title: "Authenticity",
                text: "Real culture, real people, real impact.",
              },
              {
                title: "Creativity",
                text: "Every activation tells a story.",
              },
              {
                title: "Connection",
                text: "Brands don’t speak to crowds, they speak to humans.",
              },
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-3">{v.title}</h3>
                <p className="text-gray-600">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL IMAGE */}
      <section className="max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={pic4}
            alt="The experience"
            className="rounded-3xl object-cover"
          />
        </motion.div>
      </section>

      {/* CLOSING */}
      <section className="max-w-3xl px-6 text-center pb-24">
        <h2 className="text-3xl font-bold mb-4">
          This Is Just the Beginning
        </h2>
        <p className="text-gray-600 text-lg">
          Our story continues with every event, every crowd,
          and every brand that believes in meaningful presence.
        </p>
      </section>

    </main>
  );
}
