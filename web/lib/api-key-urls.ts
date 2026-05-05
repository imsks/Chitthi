/** Build paths for Chitthi API key HTTP calls (kept separate for unit tests). */
export function deleteChitthiKeyPath(apiKey: string): string {
	return `/api/v1/apikeys/${encodeURIComponent(apiKey)}`
}

export function deleteProviderCredentialPath(provider: string): string {
	return `/api/v1/apikeys/provider/${encodeURIComponent(provider.trim())}`
}
