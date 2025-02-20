/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/cars',
        destination: 'https://main-admin-bot.revup.trio-tech.online/api/cars',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.cdn.lego-car.ru',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
