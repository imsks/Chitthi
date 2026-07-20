import { describe, expect, it } from "vitest"
import { buildSendEmailCurl, escapeDoubleQuotedShell } from "./build-send-email-curl"

describe("escapeDoubleQuotedShell", () => {
	it("escapes backslashes, double quotes, dollar, and backticks", () => {
		expect(escapeDoubleQuotedShell(`a\\b"c$d\`e`)).toBe(`a\\\\b\\"c\\$d\\\`e`)
	})
})

describe("buildSendEmailCurl", () => {
	it("builds a multiline curl with bearer auth and JSON body", () => {
		const curl = buildSendEmailCurl({
			apiBaseUrl: "http://localhost:8080/",
			bearerToken: `tok"en`,
			body: {
				from_email: "a@b.com",
				from_name: "Chitthi",
				to_email: "to@example.com",
				subject: "Test",
				html_content: "<p>Hi</p>"
			}
		})
		expect(curl).toContain(`curl -X POST "http://localhost:8080/send-email"`)
		expect(curl).toContain(`Authorization: Bearer tok\\"en`)
		expect(curl).toContain(`-d "{\\"from_email\\":\\"a@b.com\\"`)
	})
})
