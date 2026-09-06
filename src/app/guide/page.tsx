// src/app/guide/page.tsx

import type { Metadata } from "next";
import Guide from "@/components/Guide";

export const metadata: Metadata = {
  title: "Guide",
  description:
    "The telegraphic summary method of Bautista and Bondad (1997), page by page, and what this tool does with it.",
};

export default function GuidePage() {
  return <Guide />;
}
