import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import { Suspense } from "react";
import { BackButton } from "@/components/auth/BackButton";
import Image from "next/image";

export default function Handler(props: any) {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/BannerImage3.png"
          alt="Authentication Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay to reduce brightness */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10" id="stack-auth-wrapper">
        <BackButton />
        <Suspense fallback={<div>Loading...</div>}>
          <StackHandler fullPage app={stackServerApp} {...props} />
        </Suspense>
      </div>
    </div>
  );
}
