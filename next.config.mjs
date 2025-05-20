/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/attendance/:path*',
        destination: 'https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app/api/attendanceQRCode/:path*',
      },
    ]
  },
};

export default nextConfig;
