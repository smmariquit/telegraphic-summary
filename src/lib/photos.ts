// src/lib/photos.ts
//
// Photographs of the crops and animals in the sample tables, from Wikimedia
// Commons. Each carries its author and licence so the page can credit them.

import cucumber from "../../public/photos/cucumber.jpg";
import peanut from "../../public/photos/peanut.jpg";
import broiler from "../../public/photos/broiler.jpg";
import ricewine from "../../public/photos/ricewine.jpg";
import mango from "../../public/photos/mango.jpg";

export const PHOTOS = {
  cucumber: {
    src: cucumber,
    alt: "A cucumber fruit on the vine.",
    title: "ARS cucumber",
    author: "Stephen Ausmus, USDA ARS",
    license: "Public domain",
    licenseUrl: null,
    source: "https://commons.wikimedia.org/wiki/File:ARS_cucumber.jpg",
  },
  peanut: {
    src: peanut,
    alt: "A field of peanut plants.",
    title: "Field of Peanut Plants",
    author: "Alabama Extension",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "https://commons.wikimedia.org/wiki/File:Field_of_Peanut_Plants.jpg",
  },
  broiler: {
    src: broiler,
    alt: "Broiler chickens in a poultry house.",
    title: "Broiler Chickens 002",
    author: "Icem4k",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Broiler_Chickens_002.jpg",
  },
  ricewine: {
    src: ricewine,
    alt: "Tapuy, Philippine rice wine, served with biko.",
    title: "Merienda with tapuy and biko",
    author: "Shubert Ciencia",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    source: "https://commons.wikimedia.org/wiki/File:Merienda_with_tapuy_and_biko.jpg",
  },
  mango: {
    src: mango,
    alt: "Carabao mangoes from Cebu.",
    title: "Carabao Mangoes from Cebu, Philippines",
    author: "Bim24",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "https://commons.wikimedia.org/wiki/File:Carabao_Mangoes_from_Cebu,_Philippines.jpg",
  },
} as const;

export type PhotoKey = keyof typeof PHOTOS;
