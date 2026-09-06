// src/components/Photo.tsx
//
// A credited photograph. The credit is the caption; nothing is shown without it.

import Image from "next/image";
import { PHOTOS, type PhotoKey } from "@/lib/photos";

interface Props {
  photo: PhotoKey;
  /** Optional lead line before the credit. */
  caption?: string;
  /** "thumb" for list rows, "full" for a section figure. */
  size?: "thumb" | "full";
  priority?: boolean;
}

export function Credit({ photo }: { photo: PhotoKey }) {
  const p = PHOTOS[photo];
  return (
    <span className="figure__cite">
      Photo:{" "}
      <a className="link" href={p.source} target="_blank" rel="noopener">
        {p.author}
      </a>
      ,{" "}
      {p.licenseUrl ? (
        <a className="link" href={p.licenseUrl} target="_blank" rel="noopener">
          {p.license}
        </a>
      ) : (
        p.license
      )}
      , via Wikimedia Commons.
    </span>
  );
}

export default function Photo({ photo, caption, size = "full", priority }: Props) {
  const p = PHOTOS[photo];
  if (size === "thumb") {
    return (
      <Image src={p.src} alt={p.alt} className="figure__thumb" sizes="6rem" placeholder="blur" priority={priority} />
    );
  }
  return (
    <figure className="figure">
      <Image
        src={p.src}
        alt={p.alt}
        className="figure__img"
        sizes="(min-width: 1024px) 40rem, 100vw"
        placeholder="blur"
        priority={priority}
      />
      <figcaption className="figure__cap">
        {caption && <>{caption} </>}
        <Credit photo={photo} />
      </figcaption>
    </figure>
  );
}
