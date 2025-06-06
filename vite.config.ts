import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem
          "react-vendor": ["react", "react-dom", "react-router-dom"],

          // UI Component Libraries (largest dependencies)
          "radix-ui": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-aspect-ratio",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-context-menu",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-label",
            "@radix-ui/react-menubar",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group",
            "@radix-ui/react-tooltip",
          ],

          // Backend/API libraries
          "backend-libs": ["@supabase/supabase-js", "@tanstack/react-query"],

          // Form handling
          "form-libs": ["react-hook-form", "@hookform/resolvers", "zod"],

          // Utility libraries
          utils: [
            "date-fns",
            "clsx",
            "class-variance-authority",
            "tailwind-merge",
            "uuid",
          ],

          // Charts and data visualization
          charts: ["recharts"],

          // Code highlighting and markdown
          "content-libs": ["highlight.js", "marked"],

          // UI enhancement libraries
          "ui-enhancement": [
            "embla-carousel-react",
            "react-resizable-panels",
            "vaul",
            "sonner",
            "cmdk",
            "react-day-picker",
            "input-otp",
            "next-themes",
          ],

          // Icons
          icons: ["lucide-react"],
        },
      },
    },
    // Increase chunk size warning limit since we're now properly splitting
    chunkSizeWarningLimit: 600,
  },
}));
