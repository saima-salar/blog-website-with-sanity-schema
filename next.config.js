/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'], // Allow Sanity's CDN to serve images
  },
};

module.exports = nextConfig;