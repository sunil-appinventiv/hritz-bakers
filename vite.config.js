import { defineConfig } from "@lovable.dev/vite-tanstack-config";
// 1. Import the raw nitro plugin
import { nitro } from "nitro/vite";

// 2. Vercel automatically sets this environment variable to "1" during builds
const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  // 3. Turn off Lovable's Cloudflare-targeted Nitro when building on Vercel
  nitro: !isVercel, 
  vite: {
    resolve: { tsconfigPaths: true },
    // 4. Manually inject Nitro with the Vercel preset ONLY during Vercel builds
    plugins: isVercel ? [nitro({ preset: "vercel" })] : [],
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});


