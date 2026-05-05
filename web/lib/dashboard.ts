export const providerOptions = [
	{ value: "sendgrid", label: "SendGrid" },
	{ value: "breevo", label: "Breevo" },
	{ value: "mailersend", label: "MailerSend" }
]

export function maskApiKey(apiKey: string) {
	if (apiKey.length <= 8) {
		return apiKey
	}

	return `${apiKey.slice(0, 4)}••••••••${apiKey.slice(-4)}`
}