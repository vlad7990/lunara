import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Pin the workspace root. Without it Turbopack walks up to the home directory
     looking for a lockfile and infers the wrong root. */
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
