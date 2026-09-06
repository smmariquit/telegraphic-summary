// src/components/BookFigure.tsx
//
// A photograph of a page from the book, captioned and cited. Click opens the
// full-size image in a new tab.

import Image from "next/image";
import { CITE, FIGURES, type FigureKey } from "@/lib/book";

interface Props {
  fig: FigureKey;
  caption: string;
  /** Visual size. "thumb" for asides, "full" for the guide. */
  size?: "thumb" | "full";
  priority?: boolean;
}

export default function BookFigure({ fig, caption, size = "full", priority }: Props) {
  const f = FIGURES[fig];
  return (
    <figure className={`figure ${size === "thumb" ? "figure--thumb" : ""}`}>
      <a
        href={f.src.src}
        target="_blank"
        rel="noopener"
        className="figure__link"
        aria-label={`Open ${f.page} at full size`}
      >
        <Image
          src={f.src}
          alt={f.alt}
          sizes={size === "thumb" ? "(min-width: 640px) 16rem, 100vw" : "(min-width: 1024px) 40rem, 100vw"}
          priority={priority}
          placeholder="blur"
        />
      </a>
      <figcaption className="figure__cap">
        {caption}{" "}
        <span className="figure__cite">
          {CITE}, {f.page}.
        </span>
      </figcaption>
    </figure>
  );
}
