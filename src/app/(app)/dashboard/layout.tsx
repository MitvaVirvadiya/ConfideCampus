import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return (
    <main className="flex space-x-10 item-center">
      <aside className="h-screen border-r w-1/6">
        <ul className="flex flex-col items-start">
          <li className={cn(buttonVariants({ variant: "link" }))}>Home</li>
          <li className={cn(buttonVariants({ variant: "link" }))}>Analytics</li>
          <li className={cn(buttonVariants({ variant: "link" }))}>Settings</li>
          <li className={cn(buttonVariants({ variant: "link" }))}>Account</li>
        </ul>
      </aside>
      <section>{children}</section>
    </main>
  );
}
