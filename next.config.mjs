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
  images: {
    domains: [
      'res.cloudinary.com',
      'attendance-eslamrazeen-eslam-razeens-projects.vercel.app'
    ],
  },
};

export default nextConfig;
