// src/types/images.d.ts
// Static image imports typed without relying on the generated next-env.d.ts,
// so `tsc --noEmit` passes on a fresh checkout in CI.

declare module "*.jpg" {
  import type { StaticImageData } from "next/image";
  const src: StaticImageData;
  export default src;
}
