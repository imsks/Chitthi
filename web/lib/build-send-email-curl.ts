export type SendEmailCurlBody = {
	from_email?: string
	from_name?: string
	to_email: string
	subject: string
	html_content: string
}

/** Escape a string for inclusion inside double quotes in bash/sh. */
export function escapeDoubleQuotedShell(s: string): string {
	return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\$/g, "\\$").replace(/`/g, "\\`")
}

/**
 * Multiline curl for POST /send-email using Authorization: Bearer (same key may be sent as JSON `api_key` or X-Chitthi-API-Key).
 */
export function buildSendEmailCurl(args: { apiBaseUrl: string; bearerToken: string; body: SendEmailCurlBody }): string {
	const base = args.apiBaseUrl.replace(/\/$/, "")
	const keyEsc = escapeDoubleQuotedShell(args.bearerToken)
	const json = JSON.stringify(args.body)
	const d = escapeDoubleQuotedShell(json)
	return [
		`curl -X POST "${base}/send-email" \\`,
		`  -H "Content-Type: application/json" \\`,
		`  -H "Authorization: Bearer ${keyEsc}" \\`,
		`  -d "${d}"`
	].join("\n")
}
