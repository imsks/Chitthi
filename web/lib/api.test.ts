import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createAPIKey, getMe } from "./api"

describe("api client", () => {
	beforeEach(() => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() =>
				Promise.resolve(
					new Response(JSON.stringify({ user: { id: 1, name: "Ada", email: "ada@example.com", is_onboarded: false } }), {
						status: 200,
						headers: { "Content-Type": "application/json" }
					})
				)
			)
		)
	})

	afterEach(() => {
		vi.unstubAllGlobals()
		vi.restoreAllMocks()
	})

	it("getMe requests session API with credentials", async () => {
		const me = await getMe()
		expect(me.user.email).toBe("ada@example.com")
		expect(vi.mocked(fetch)).toHaveBeenCalledWith("/api/v1/user/me", expect.objectContaining({ credentials: "include" }))
	})

	it("createAPIKey appends expiry query when provided", async () => {
		vi.mocked(fetch).mockResolvedValueOnce(
			new Response(JSON.stringify({ api_key: "ck_test" }), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			})
		)
		const out = await createAPIKey("2030-01-01T00:00:00Z")
		expect(out.api_key).toBe("ck_test")
		expect(vi.mocked(fetch)).toHaveBeenCalledWith(
			"/api/v1/apikeys?expiry=2030-01-01T00%3A00%3A00Z",
			expect.objectContaining({ method: "POST" })
		)
	})

	it("throws with error field from JSON body", async () => {
		vi.mocked(fetch).mockResolvedValueOnce(
			new Response(JSON.stringify({ error: "Forbidden" }), {
				status: 403,
				headers: { "Content-Type": "application/json" }
			})
		)
		await expect(getMe()).rejects.toThrow("Forbidden")
	})

	it("throws with message field when error is absent", async () => {
		vi.mocked(fetch).mockResolvedValueOnce(
			new Response(JSON.stringify({ message: "Try again" }), {
				status: 422,
				headers: { "Content-Type": "application/json" }
			})
		)
		await expect(getMe()).rejects.toThrow("Try again")
	})

	it("falls back to statusText when body is not JSON", async () => {
		vi.mocked(fetch).mockResolvedValueOnce(new Response("plain", { status: 502, statusText: "Bad Gateway" }))
		await expect(getMe()).rejects.toThrow("Bad Gateway")
	})
})
