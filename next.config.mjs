/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/search",
        destination: "/",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["img.spoonacular.com"],
  },
};

export default nextConfig;
