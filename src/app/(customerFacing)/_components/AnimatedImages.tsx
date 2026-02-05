'use client'
import React, { useState } from 'react'
import PageHeader from './PageHeader';
import { motion } from "framer-motion";
import Image, { StaticImageData } from 'next/image';
import img1 from '@/../public/general/3rdsection/SouthernJerks-Sep25-78.jpg'
import img2 from '@/../public/general/3rdsection/SouthernJerks-Sep25-73.jpg'
import img3 from '@/../public/general/3rdsection/SouthernJerks-Sep25-52.jpg'
import img4 from '@/../public/general/3rdsection/SouthernJerks-Sep25-59.jpg'
import img5 from '@/../public/general/3rdsection/SouthernJerks-Sep25-55.jpg'
import img6 from '@/../public/general/3rdsection/SouthernJerks-Sep25-63.jpg'
import img7 from '@/../public/general/3rdsection/SouthernJerks-Sep25-58.jpg'
import img8 from '@/../public/general/3rdsection/SouthernJerks-Sep25-53.jpg'
import img9 from '@/../public/general/3rdsection/SouthernJerks-Sep25-42.jpg'
import img10 from '@/../public/general/3rdsection/SouthernJerks-Sep25-46.jpg'
import img11 from '@/../public/general/3rdsection/SouthernJerks-Sep25-27.jpg'
import img12 from '@/../public/general/3rdsection/SouthernJerks-Sep25-25.jpg'





export function ThirdSectionComponent() {
  const images = [img1,img2,img3,img4,img5,img6,img7,img8,img9,img10,img11,img12]
  return (
    <div className=" sm:w-[85vw] p-2 space-y-10 ">
      <div className="space-y-4">
        <PageHeader>Southern Jerks®</PageHeader>
        <span className="font-medium text-neutral-600 text-lg"> Quiet Mouth. Loud Flavor.</span>
      </div>


      <main className="grid grid-cols-2  sm:grid-cols-3  md:grid-cols-3  w-full gap-6 ">
        {images.map((image,i)=>(
          <HoverCard key={i} src={image} title="Lovely moment at Southern Jerks :)" />
        ))}
        
        
      </main>
    </div>

  )
}

export function HoverCard({
  src,
  title,
}: {
  src: StaticImageData;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const MotionImage = motion.create(Image);

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-lg"
    >
      {/* Skeleton (same size, no layout shift) */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse z-10" />
      )}

      {/* Image */}
      <MotionImage
        loading="lazy"
        src={src}
        alt={title}
        className="object-cover w-full h-full"
        onLoadingComplete={() => setLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        variants={{
          rest: { scale: 1, y: 0 },
          hover: { scale: 1.06, y: -6 },
        }}
      />

      {/* Overlay (unchanged) */}
      <motion.div
        variants={{
          rest: { opacity: 0, y: 8 },
          hover: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="absolute inset-0 bg-black/40 flex items-end p-4"
        style={{ pointerEvents: "none" }}
      >
        <motion.h3 className="text-white text-lg font-semibold">
          {title}
        </motion.h3>
      </motion.div>
    </motion.div>
  )
}