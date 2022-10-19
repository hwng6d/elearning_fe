/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['nextgoal-bucket.s3.us-east-2.amazonaws.com', 'localhost']
  }
}

export default nextConfig