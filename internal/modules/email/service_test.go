package email

import (
	"testing"

	"github.com/imsks/chitthi/internal/database/postgres"
)

func TestCredentialsMatchingProviderHint(t *testing.T) {
	t.Parallel()
	all := []*postgres.PrimaryProviderCredential{
		{ProviderName: "sendgrid", SenderEmail: "a@b.com"},
		{ProviderName: "mailersend", SenderEmail: "c@d.com"},
	}

	got := credentialsMatchingProviderHint(all, "mailersend")
	if len(got) != 1 || got[0].ProviderName != "mailersend" {
		t.Fatalf("mailersend: %#v", got)
	}

	if len(credentialsMatchingProviderHint(all, "")) != 2 {
		t.Fatal("empty hint should keep all")
	}
	if len(credentialsMatchingProviderHint(all, "UNKNOWN")) != 2 {
		t.Fatal("unknown hint falls back to all")
	}
}
