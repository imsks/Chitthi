export type ProviderOption = { value: string; label: string }

export type ProviderCredentialSummary = { provider: string; sender_email: string }

/** Normalizes GET /apikeys/provider payloads (supports legacy responses with only `providers`). */
export function normalizeProviderCredentialRows(res: {
	providers?: string[]
	provider_credentials?: { provider?: unknown; sender_email?: unknown }[]
}): ProviderCredentialSummary[] {
	const creds = res.provider_credentials
	if (Array.isArray(creds) && creds.length > 0) {
		return creds.map((row) => ({
			provider: typeof row.provider === "string" ? row.provider : "",
			sender_email: typeof row.sender_email === "string" ? row.sender_email : ""
		}))
	}
	const names = Array.isArray(res.providers) ? res.providers : []
	return names.map((provider) => ({ provider, sender_email: "" }))
}

/** Providers from the catalog that the user has not configured yet (value = API id, e.g. mailersend). */
export function providersNotYetConfigured(options: ProviderOption[], configuredProviderIds: Set<string>): ProviderOption[] {
	return options.filter((o) => !configuredProviderIds.has(o.value))
}
