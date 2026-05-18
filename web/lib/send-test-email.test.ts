import { describe, expect, it } from "vitest"
import { buildSendTestEmailBody } from "./send-test-email"

describe("buildSendTestEmailBody", () => {
	it("includes provider hint and from_email for row-scoped tests", () => {
		const body = buildSendTestEmailBody({
			toEmail: "user@example.com",
			fromEmail: "sender@verified.example",
			provider: "mailersend"
		})
		expect(body).toMatchObject({
			to_email: "user@example.com",
			from_email: "sender@verified.example",
			provider: "mailersend",
			subject: "Chitthi API test"
		})
		expect(body.html_content).toContain("Chitthi")
	})
})
