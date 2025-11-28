import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import { Suspense } from "react";
import { BackButton } from "@/components/auth/BackButton";

export default function Handler(props: any) {
  return (
    <>
      <BackButton />
      <Suspense fallback={<div>Loading...</div>}>
        <StackHandler fullPage app={stackServerApp} {...props} />
      </Suspense>
    </>
  );
}
