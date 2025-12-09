import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_HK_TOKEN: process.env.NEXT_PUBLIC_HK_TOKEN || "",
    HK_TOKEN: process.env.HK_TOKEN || "",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_MY_GEMINI_TOKEN: process.env.NEXT_PUBLIC_MY_GEMINI_TOKEN,
  },
};

export default nextConfig;
