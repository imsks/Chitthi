package email

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/imsks/chitthi/internal/database/postgres"
)

// ChitthiResolver loads provider credentials for a valid Chitthi (unified) API key.
type ChitthiResolver struct {
	apiKeyDAO   *postgres.APIKeyDAO
	providerDAO *postgres.ProviderAPIKeysDAO
}

// NewChitthiResolver wires Postgres DAOs for Bearer / X-Chitthi-API-Key resolution.
func NewChitthiResolver(apiKeyDAO *postgres.APIKeyDAO, providerDAO *postgres.ProviderAPIKeysDAO) *ChitthiResolver {
	return &ChitthiResolver{apiKeyDAO: apiKeyDAO, providerDAO: providerDAO}
}

// ExtractChitthiAPIKey reads X-Chitthi-API-Key or Authorization: Bearer.
func ExtractChitthiAPIKey(r *http.Request) string {
	if v := strings.TrimSpace(r.Header.Get("X-Chitthi-API-Key")); v != "" {
		return v
	}
	auth := strings.TrimSpace(r.Header.Get("Authorization"))
	if len(auth) >= 7 && strings.EqualFold(auth[:7], "bearer ") {
		return strings.TrimSpace(auth[7:])
	}
	return ""
}

// ChitthiAPIKeyFromBodyOrHeader prefers JSON `api_key`, then X-Chitthi-API-Key, then Authorization: Bearer.
func ChitthiAPIKeyFromBodyOrHeader(r *http.Request, bodyAPIKey string) string {
	if k := strings.TrimSpace(bodyAPIKey); k != "" {
		return k
	}
	return ExtractChitthiAPIKey(r)
}

func mapPrimaryCredential(c *postgres.PrimaryProviderCredential) map[string]string {
	if c == nil {
		return nil
	}
	out := make(map[string]string)
	switch c.ProviderName {
	case "sendgrid":
		out["sendgrid_api_key"] = c.APIKey
		out["sendgrid_region"] = "global"
	case "breevo":
		out["breevo_api_key"] = c.APIKey
	case "mailersend":
		out["mailersend_api_key"] = c.APIKey
	default:
		return nil
	}
	return out
}

// Resolve validates the Chitthi key and returns credential headers map + default from address.
func (r *ChitthiResolver) Resolve(ctx context.Context, chitthiAPIKey string) (map[string]string, string, error) {
	if r == nil || r.apiKeyDAO == nil || r.providerDAO == nil {
		return nil, "", fmt.Errorf("chitthi resolver not configured")
	}
	userID, err := r.apiKeyDAO.GetUserIDByActiveAPIKey(ctx, chitthiAPIKey)
	if err != nil {
		return nil, "", fmt.Errorf("invalid or expired Chitthi API key")
	}

	cred, err := r.providerDAO.GetPrimaryProviderCredential(ctx, userID)
	if err != nil || cred == nil {
		return nil, "", fmt.Errorf("no provider credentials configured for this account")
	}

	m := mapPrimaryCredential(cred)
	if len(m) == 0 {
		return nil, "", fmt.Errorf("unsupported provider for unified send")
	}
	if strings.TrimSpace(cred.SenderEmail) == "" {
		return nil, "", fmt.Errorf("verified sender email is not configured for your provider connection")
	}
	return m, strings.TrimSpace(cred.SenderEmail), nil
}

// ResolveAll validates the Chitthi key and returns all supported provider credentials for failover.
func (r *ChitthiResolver) ResolveAll(ctx context.Context, chitthiAPIKey string) ([]*postgres.PrimaryProviderCredential, error) {
	if r == nil || r.apiKeyDAO == nil || r.providerDAO == nil {
		return nil, fmt.Errorf("chitthi resolver not configured")
	}

	userID, err := r.apiKeyDAO.GetUserIDByActiveAPIKey(ctx, strings.TrimSpace(chitthiAPIKey))
	if err != nil {
		return nil, fmt.Errorf("invalid or expired Chitthi API key")
	}

	credentials, err := r.providerDAO.GetAllProviderCredentials(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("no provider credentials configured for this account")
	}

	usable := make([]*postgres.PrimaryProviderCredential, 0, len(credentials))
	for _, cred := range credentials {
		if cred == nil {
			continue
		}
		if len(mapPrimaryCredential(cred)) == 0 {
			continue
		}
		if strings.TrimSpace(cred.SenderEmail) == "" {
			continue
		}
		usable = append(usable, cred)
	}

	if len(usable) == 0 {
		return nil, fmt.Errorf("no usable provider credentials configured for this account")
	}

	return usable, nil
}
