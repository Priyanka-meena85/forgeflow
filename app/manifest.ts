import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ForgeFlow Industrial AEO & SEO SaaS",
    short_name: "ForgeFlow",
    description: "Enterprise Answer Engine & Technical SEO content optimization platform for industrial manufacturing.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#0891b2",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
