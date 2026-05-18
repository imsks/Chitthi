import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./")
		}
	},
	test: {
		setupFiles: ["./vitest.setup.ts"],
		environmentMatchGlobs: [["**/*.test.tsx", "jsdom"]],
		environment: "node",
		include: ["**/*.{test.ts,test.tsx}"]
	}
})
