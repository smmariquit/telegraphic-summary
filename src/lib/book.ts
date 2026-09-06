// src/lib/book.ts
//
// Photographs of the 1997 printing, with the page each shows. Used as figures.

import cover from "../../public/book/cover.jpg";
import p80 from "../../public/book/p80.jpg";
import p81 from "../../public/book/p81.jpg";
import p81yield from "../../public/book/p81-yield.jpg";
import p82 from "../../public/book/p82.jpg";
import p83 from "../../public/book/p83.jpg";
import p84 from "../../public/book/p84.jpg";
import p85 from "../../public/book/p85.jpg";

export const CITE = "Bautista and Bondad, 1997";
export const BOOK = "Technical Writing for Beginners";

export const FIGURES = {
  cover: {
    src: cover,
    page: "cover",
    alt: "Cover of Technical Writing for Beginners by Ofelia K. Bautista and Nestor D. Bondad, 1997.",
  },
  p80: {
    src: p80,
    page: "p. 80",
    alt: "Page 80, the start of Chapter 11, Interpreting Data, with the three-step procedure and the first two telegraphic lines.",
  },
  p81: {
    src: p81,
    page: "p. 81",
    alt: "Page 81, Table 5: growth and yield of Pointsett cucumber applied with different fertilizers, with mean-separation letters.",
  },
  p81yield: {
    src: p81yield,
    page: "p. 81",
    alt: "One row of Table 5: total weight of fruits, 1500a, 1300a, 600b, 650b.",
  },
  p82: {
    src: p82,
    page: "p. 82",
    alt: "Page 82: the telegraphic lines collapsed into two groups, A=B=C=D and A=B>[C=D], and the two sentences they become.",
  },
  p83: {
    src: p83,
    page: "p. 83",
    alt: "Page 83: state trends not data one by one; use statistical analysis as the guide; insignificant means no effect.",
  },
  p84: {
    src: p84,
    page: "p. 84",
    alt: "Page 84: state the effects, use significant sparingly, relate findings to others, discuss interactions.",
  },
  p85: {
    src: p85,
    page: "p. 85",
    alt: "Page 85: explain unexpected results, one table at a time, interpret rather than state the data.",
  },
} as const;

export type FigureKey = keyof typeof FIGURES;
