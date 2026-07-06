import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdKeyboardArrowRight } from "react-icons/md";
import { PiInstagramLogoFill } from "react-icons/pi";
import { FaTiktok } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import Logo from "@/../public/general/logo/logo.png";

export function Footer() {
  return (
    <div className="flex w-full text-sm gap-4 items-center md:py-10  justify-between md:justify-center flex-col h-140 sm:h-60 sm:space-x-10  sm:pr-10  md:w-[98%] bg-stone-200 rounded-4xl">
      <div className=" flex flex-col md:flex-row  md:justify-center w-full h-4/5">
        <div className="flex  items-start sm:h-full h-1/3 justify-center w-full md:w-32">
          <Link href="/">
            <Image
              alt="Southern Jerks logo"
              className="w-auto h-auto"
              src={Logo}
              height={70}
              width={70}
            />
          </Link>
        </div>
        <div className="flex text-start md:space-x-20 text-sm items-start p-4 md:justify-start md:pl-16 font-semibold w-full md:w-3/5 flex-col md:flex-row">
          <div className="flex flex-col gap-2">
            <Button variant="link">
              <Link href="/">Home</Link>
            </Button>
            <Button variant="link">
              <Link href="/Menu">Menu</Link>
            </Button>
            <Button variant="link">
              <Link href="/Blog">Press</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="link">
              <Link href="/catering">Catering</Link>
            </Button>
            <Button variant="link">
              <Link href="/GiftCard">Gift Card</Link>
            </Button>
            <Button variant="link">
              <Link href="/KidsZone">Kids Zone</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="link">
              <Link className="text-start" href="/Menu">
                View our menu
              </Link>
            </Button>
          </div>
        </div>
        <div className="md:h-full flex flex-col gap-4 justify-between h-1/5  w-full pt-2  md:w-1/5 ">
          <Link href="/Menu">
            <Button size="sm" className="w-full" variant="mainButton">
              View our menu
              <MdKeyboardArrowRight />
            </Button>
          </Link>
          <div className="w-full flex gap-4  justify-center">
            <Link
              href="https://www.tiktok.com/@southernjerkshtx?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Southern Jerks on TikTok"
              className="transition-transform duration-150 hover:scale-110 hover:text-[#de9b00]"
            >
              <FaTiktok size={24} />
            </Link>
            <Link
              href="https://www.instagram.com/southernjerkshtx/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Southern Jerks on Instagram"
              className="transition-transform duration-150 hover:scale-110 hover:text-[#de9b00]"
            >
              <PiInstagramLogoFill size={25} />
            </Link>
            <Link
              href="https://www.facebook.com/p/Southern-Jerks-100076329252325"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Southern Jerks on Facebook"
              className="transition-transform duration-150 hover:scale-110 hover:text-[#de9b00]"
            >
              <FaFacebook size={25} />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center  justify-center md:justify-start   w-full py-2  border md:w-2/3  border-t-gray-300">
        <Button variant="link">
          <Link className="text-gray-500" href="/terms">
            Terms & Policies
          </Link>
        </Button>
      </div>
    </div>
  );
}
