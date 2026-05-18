export type EmailSendApiResponse = {
	status?: boolean
	message?: string
	error?: { code?: string; message?: string }
}

export function buildSendTestEmailBody(args: { toEmail: string; provider: string; fromEmail: string }) {
	return {
		to_email: args.toEmail.trim(),
		subject: "Chitthi API test",
		html_content: "<p>Hello — Chitthi provider test email.</p>",
		from_name: "Chitthi",
		from_email: args.fromEmail.trim(),
		provider: args.provider.trim()
	}
}

/** Same-origin POST `/send-email` (Next rewrite → Chitthi API). */
export async function sendTestEmailViaChitthi(args: {
	chitthiApiKey: string
	toEmail: string
	provider: string
	fromEmail: string
}): Promise<{ ok: true } | { ok: false; message: string }> {
	const body = buildSendTestEmailBody({
		toEmail: args.toEmail,
		provider: args.provider,
		fromEmail: args.fromEmail
	})
	const res = await fetch("/send-email", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${args.chitthiApiKey.trim()}`
		},
		body: JSON.stringify(body)
	})
	let data: EmailSendApiResponse = {}
	try {
		data = (await res.json()) as EmailSendApiResponse
	} catch {
		// non-JSON body
	}
	if (res.ok && data.status === true) {
		return { ok: true }
	}
	const msg =
		(typeof data.message === "string" && data.message.trim() !== "")
			? data.message
			: (typeof data.error?.message === "string" && data.error.message.trim() !== "")
				? data.error.message
				: `${res.status} ${res.statusText}`.trim()
	return { ok: false, message: msg || "Request failed" }
}
