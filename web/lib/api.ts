import { deleteChitthiKeyPath, deleteProviderCredentialPath } from "./api-key-urls"

export type User = {
	id: number
	name: string
	email: string
	is_onboarded: boolean
	profession?: string | null
	created_at?: string
	updated_at?: string
}

type RequestOptions = Omit<RequestInit, "body"> & {
	body?: unknown
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const response = await fetch(path, {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {})
		},
		body: options.body === undefined ? undefined : JSON.stringify(options.body),
		cache: "no-store"
	})

	if (!response.ok) {
		let message = "Request failed"
		try {
			const payload = (await response.json()) as { error?: string; message?: string }
			message = payload.error || payload.message || message
		} catch {
			message = response.statusText || message
		}
		throw new Error(message)
	}

	if (response.status === 204) {
		return undefined as T
	}

	return (await response.json()) as T
}

export function logout() {
	return apiRequest<{ logged_out: boolean }>("/api/v1/auth/logout", {
		method: "POST"
	})
}

export function getMe() {
	return apiRequest<{ user: User }>("/api/v1/user/me")
}

export function completeOnboarding() {
	return apiRequest<{ message: string }>("/api/v1/user/onboarding", {
		method: "POST"
	})
}

export function createAPIKey(expiry?: string) {
	const searchParams = new URLSearchParams()
	if (expiry) {
		searchParams.set("expiry", expiry)
	}

	const query = searchParams.toString()
	return apiRequest<{ api_key: string }>(`/api/v1/apikeys${query ? `?${query}` : ""}`, {
		method: "POST"
	})
}

export function getAPIKeys() {
	return apiRequest<{ api_keys: string[] }>("/api/v1/apikeys")
}

export function addProviderAPIKey(provider: string, apiKey: string, senderEmail: string) {
	return apiRequest<{ message: string }>("/api/v1/apikeys/provider", {
		method: "POST",
		body: { provider, api_key: apiKey, sender_email: senderEmail }
	})
}

export function getProviderAPIKeys() {
	return apiRequest<{ providers: string[]; default_sender_email?: string }>("/api/v1/apikeys/provider")
}

export function deleteAPIKey(apiKey: string) {
	return apiRequest<{ message: string }>(deleteChitthiKeyPath(apiKey), {
		method: "DELETE"
	})
}

export function deleteProviderAPIKey(provider: string) {
	return apiRequest<{ message: string }>(deleteProviderCredentialPath(provider), {
		method: "DELETE"
	})
}