import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Vercel automatically sets this to "1" during its build process
const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  // When building on Vercel, force Nitro to use the Vercel preset AND the correct hidden output folder.
  // When inside Lovable, keep it as `true` so your preview doesn't break.
  nitro: isVercel ? {
    preset: "vercel",
    output: { dir: ".vercel/output" }
  } : true,
  vite: {
    resolve: { tsconfigPaths: true },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});