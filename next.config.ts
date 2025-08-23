import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
remotePatterns: [
{ protocol: 'https', hostname: '**.supabase.co' },
{ protocol: 'https', hostname: '**.amazonaws.com' },
{ protocol: 'https', hostname: '**' }
]
}
};

export default nextConfig;
