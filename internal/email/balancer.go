package adapters

import (
	"github.com/imsks/chitthi/internal/model"
)

type LoadBalancer struct {
	providers []EmailProvider
}

func NewLoadBalancer(providers []EmailProvider) *LoadBalancer {
	// Filter only available providers
	var availableProviders []EmailProvider
	for _, provider := range providers {
		if provider.IsAvailable() {
			availableProviders = append(availableProviders, provider)
		}
	}

	return &LoadBalancer{providers: availableProviders}
}

func (lb *LoadBalancer) SendEmail(req model.EmailRequest) (string, error) {
	var lastError error

	for _, provider := range lb.providers {
		err := provider.SendEmail(req)
		if err == nil {
			return provider.GetName(), nil
		}
		lastError = err
	}

	return "", lastError
}

func (lb *LoadBalancer) GetAvailableProviders() []string {
	var names []string
	for _, provider := range lb.providers {
		names = append(names, provider.GetName())
	}
	return names
}
