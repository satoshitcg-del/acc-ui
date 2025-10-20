import react from "@vitejs/plugin-react";
import envars from "envars";
import path, { resolve } from "node:path";
import { URL } from "node:url";
import { defineConfig } from "vite";
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";
import { Config } from "./core/config.js";

// The list of supported environments
const mode = process.env.mode || "local"
const envNames = [mode]
const useObfuscate = process.env.OBFUSCATE === 'true'

// Bootstrap client-side configuration from environment variables
const configs = envNames.map((envName): Config => {
  const envDir = resolve(__dirname, "../env");
  const env = envars.config({ env: envName, cwd: envDir });
  return {
    app: {
      env: envName,
      name: env.APP_NAME,
      origin: env.APP_ORIGIN,
      hostname: new URL(env.APP_ORIGIN).hostname,
      api: env.LOCAL_API_ORIGIN ?? env.API_ORIGIN,
      sitekey: env.SITE_KEY,
      enable_feature: env.ENABLE_FEATURE?.split(",")
    }
  }
});

// Pass client-side configuration to the web app
// https://vitejs.dev/guide/env-and-mode.html#env-variables-and-modes
process.env.VITE_CONFIG = JSON.stringify(configs);

/**
 * Vite configuration
 * https://vitejs.dev/config/
 */
export default defineConfig({
  cacheDir: `../.cache/vite-app`,
  esbuild: {
    drop: mode === "prd" ? ['console', 'debugger'] : [],
  },
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom", "react-quill", "recoil"],
        },
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },

  plugins: [
    // The default Vite plugin for React projects
    // https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md
    useObfuscate && obfuscatorPlugin({
      options: {
        compact: true, // บีบอัดให้เป็นบรรทัดเดียว
        controlFlowFlattening: true, // เปลี่ยน flow โค้ดให้แยกยาก
        controlFlowFlatteningThreshold: 1, // ใช้ 100% ของโค้ด
        deadCodeInjection: true, // ใส่โค้ดขยะ
        deadCodeInjectionThreshold: 1, // ใส่ให้หมด
        stringArray: true, // ย้าย string ไปเก็บใน array
        stringArrayEncoding: ['base64'], // เข้ารหัส string
        stringArrayThreshold: 1, // ย้าย string ทั้งหมด
        rotateStringArray: true, // สลับ index ของ string array
        selfDefending: true, // ป้องกันไม่ให้ prettify/reverse
        transformObjectKeys: true, // เปลี่ยนชื่อ key ใน object
        identifierNamesGenerator: 'hexadecimal', // ตั้งชื่อมั่วเป็น hex
        numbersToExpressions: true, // แปลงเลขเป็น expression
      }
    }),
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        compact: true,
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],

  server: {
    open: true,
    proxy: {
      "/api": {
        target: process.env.LOCAL_API_ORIGIN ?? process.env.API_ORIGIN,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
