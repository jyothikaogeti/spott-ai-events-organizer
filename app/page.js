import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden pb-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center sm:text-left">
            <span className="text-gray-500 font-light tracking-wide mb-6">
              spott<span className="text-purple-400">*</span>
            </span>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
              Discover &<br />
              create amazing
              <br />
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                events.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 font-light max-w-lg mb-12">
              Whether you&apos;re hosting or attending, Spott makes every event
              memorable. Join our community today.
            </p>

            <Link href="/explore">
              <Button size="xl" className="rounded-full">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="relative block">
            <Image
              src="/hero-image.png"
              alt="Hero Image of a Rock Concert"
              width={700}
              height={700}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}
