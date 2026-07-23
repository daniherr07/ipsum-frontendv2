import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "dl.dropboxusercontent.com"
    }],
  },
  experimental: {
    serverActions: {
      // Las 3 subidas de fotos (proyecto, ubicación, cédula de familiar)
      // llaman a su Server Action pasándole el File directo como argumento
      // (ver saveImages.jsx, saveLocationImages.jsx, uploadMemberPhoto.jsx),
      // así que quedan sujetas a este límite — el default de Next.js es
      // 1mb, que es justo la restricción que se estaba viendo.
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
