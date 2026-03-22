/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  // Headers pour optimiser les performances et la sécurité
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  // Aucune image distante n'est nécessaire ici, on coupe donc l'optimizer
  // pour réduire la surface d'attaque et éviter le cache disque next/image.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
