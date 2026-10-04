import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Resultados compartidos: visibles para quien tenga el link, fuera de Google.
        // No se bloquean en robots.txt porque X dejaría de mostrar la vista previa.
        source: "/r/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
      }
    ];
  }
};

export default nextConfig;
