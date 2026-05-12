import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import chatHandler from "./api/chat";

const applyEnv = (key: string, value?: string) => {
  const trimmed = value?.trim();
  if (!process.env[key] && trimmed && trimmed !== "undefined") {
    process.env[key] = trimmed;
  }
};

const localApiPlugin = (mode: string): Plugin => ({
  name: "local-api",
  configureServer(server) {
    const env = loadEnv(mode, process.cwd(), "");
    applyEnv("OPENAI_API", env.OPENAI_API);
    applyEnv("OPENAI_API_KEY", env.OPENAI_API_KEY);
    applyEnv("OPENAI_CHAT_MODEL", env.OPENAI_CHAT_MODEL);

    server.middlewares.use("/api/chat", (request, response) => {
      void chatHandler(request, response);
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [localApiPlugin(mode), react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
