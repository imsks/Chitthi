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

export function login(email: string, password: string) {
	return apiRequest<{ logged_in: boolean; user: User }>("/api/v1/auth/login", {
		method: "POST",
		body: { email, password }
	})
}

export function logout() {
	return apiRequest<{ logged_out: boolean }>("/api/v1/auth/logout", {
		method: "POST"
	})
}

export function signup(name: string, email: string, password: string, profession?: string) {
	return apiRequest<{ user: User }>("/api/v1/auth/register", {
		method: "POST",
		body: { name, email, password, profession: profession || "" }
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

export function addProviderAPIKey(provider: string, apiKey: string) {
	return apiRequest<{ message: string }>("/api/v1/apikeys/provider", {
		method: "POST",
		body: { provider, api_key: apiKey }
	})
}

export function getProviderAPIKeys() {
	return apiRequest<{ providers: string[] }>("/api/v1/apikeys/provider")
}