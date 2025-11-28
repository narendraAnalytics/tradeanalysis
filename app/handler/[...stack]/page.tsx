import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack/server";
import { Suspense } from "react";

export default function Handler(props: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StackHandler fullPage app={stackServerApp} {...props} />
    </Suspense>
  );
}
