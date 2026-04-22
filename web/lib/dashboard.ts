export const providerOptions = [
	{ value: "sendgrid", label: "SendGrid" },
	{ value: "breevo", label: "Breevo" },
	{ value: "mailersend", label: "MailerSend" },
	{ value: "mailchimp", label: "Mailchimp" },
	{ value: "smtp", label: "SMTP" }
]

export function getDefaultExpiryDate() {
	const date = new Date()
	date.setFullYear(date.getFullYear() + 1)
	return date.toISOString().split("T")[0]
}

export function maskApiKey(apiKey: string) {
	if (apiKey.length <= 8) {
		return apiKey
	}

	return `${apiKey.slice(0, 4)}••••••••${apiKey.slice(-4)}`
}