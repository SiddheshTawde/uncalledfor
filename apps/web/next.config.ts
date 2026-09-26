import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/domain", "@workspace/store", "@workspace/ui"],
}

export default nextConfig
