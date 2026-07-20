import { describe, expect, it } from "vitest"
import { deleteChitthiKeyPath, deleteProviderCredentialPath } from "./api-key-urls"

describe("deleteChitthiKeyPath", () => {
	it("encodes the key for the path segment", () => {
		expect(deleteChitthiKeyPath("a+b")).toBe("/api/v1/apikeys/a%2Bb")
	})
})

describe("deleteProviderCredentialPath", () => {
	it("trims and encodes provider name", () => {
		expect(deleteProviderCredentialPath("  sendgrid  ")).toBe("/api/v1/apikeys/provider/sendgrid")
	})
})
