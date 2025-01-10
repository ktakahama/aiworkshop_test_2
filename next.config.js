/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ["postcss-loader"],
    });
    return config;
  },
};

module.exports = nextConfig;
