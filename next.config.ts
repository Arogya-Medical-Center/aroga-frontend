import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // When multiple lockfiles exist in parent folders, Next may infer the wrong workspace root.
  // Set outputFileTracingRoot to the project directory to avoid that and make dev start reliably.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
