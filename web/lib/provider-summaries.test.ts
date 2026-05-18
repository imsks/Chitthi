import { describe, expect, it } from "vitest"
import { normalizeProviderCredentialRows, providersNotYetConfigured, type ProviderOption } from "./provider-summaries"

describe("normalizeProviderCredentialRows", () => {
	it("prefers provider_credentials when present", () => {
		const rows = normalizeProviderCredentialRows({
			providers: ["sendgrid"],
			provider_credentials: [{ provider: "mailersend", sender_email: "a@b.com" }]
		})
		expect(rows).toEqual([{ provider: "mailersend", sender_email: "a@b.com" }])
	})

	it("falls back to providers names with empty email", () => {
		expect(normalizeProviderCredentialRows({ providers: ["breevo"] })).toEqual([{ provider: "breevo", sender_email: "" }])
	})
})

describe("providersNotYetConfigured", () => {
	const options: ProviderOption[] = [
		{ value: "sendgrid", label: "SendGrid" },
		{ value: "mailersend", label: "MailerSend" }
	]

	it("returns only options absent from configured set", () => {
		const remaining = providersNotYetConfigured(options, new Set(["sendgrid"]))
		expect(remaining).toEqual([{ value: "mailersend", label: "MailerSend" }])
	})

	it("returns all options when configured is empty", () => {
		expect(providersNotYetConfigured(options, new Set())).toEqual(options)
	})
})
