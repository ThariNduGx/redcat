"use client";

import type { ComponentProps } from "react";
import ArrowLink from "@/components/ui/ArrowLink";
import { careerApplicationHref } from "@/lib/careerRegistration";

type Props = Omit<ComponentProps<typeof ArrowLink>, "href" | "onClick"> & { roleId: string };

export default function CareerApplyLink({ roleId, ...props }: Props) {
  const href = careerApplicationHref(roleId);

  return (
    <ArrowLink
      {...props}
      href={href}
      onClick={(event) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const { pathname, search, hash } = window.location;
        if (`${pathname}${search}${hash}` !== href) return;
        event.preventDefault();
        document.getElementById("apply")?.scrollIntoView();
      }}
    />
  );
}
