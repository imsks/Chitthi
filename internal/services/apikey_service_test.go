package services

import (
	"errors"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
)

func TestNormalizeUserAPIKeyExpiry_DefaultOneYear(t *testing.T) {
	now := time.Now().UTC()
	got := NormalizeUserAPIKeyExpiry("")
	exp, err := time.Parse(time.RFC3339, got)
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	min := now.AddDate(1, 0, -2)
	max := now.AddDate(1, 0, 2)
	if exp.Before(min) || exp.After(max) {
		t.Fatalf("expected ~365d ahead, got %v (window %v–%v)", exp, min, max)
	}
}

func TestNormalizeUserAPIKeyExpiry_Passthrough(t *testing.T) {
	in := "2030-01-15T12:00:00Z"
	if got := NormalizeUserAPIKeyExpiry(in); got != in {
		t.Fatalf("got %q", got)
	}
}

func TestEffectiveProviderAPIKeyForUpsert(t *testing.T) {
	t.Parallel()
	key, err := EffectiveProviderAPIKeyForUpsert("  ab  ", "", pgx.ErrNoRows)
	if err != nil || key != "ab" {
		t.Fatalf("nonempty incoming: got %q err %v", key, err)
	}
	key, err = EffectiveProviderAPIKeyForUpsert("", "stored", nil)
	if err != nil || key != "stored" {
		t.Fatalf("empty + existing: got %q err %v", key, err)
	}
	_, err = EffectiveProviderAPIKeyForUpsert("", "", pgx.ErrNoRows)
	if !errors.Is(err, ErrProviderAPIKeyRequired) {
		t.Fatalf("no rows: expected ErrProviderAPIKeyRequired, got %v", err)
	}
	_, err = EffectiveProviderAPIKeyForUpsert("", "", errors.New("db down"))
	if err == nil || errors.Is(err, ErrProviderAPIKeyRequired) {
		t.Fatalf("unexpected err %v", err)
	}
	_, err = EffectiveProviderAPIKeyForUpsert("", "  ", nil)
	if !errors.Is(err, ErrProviderAPIKeyRequired) {
		t.Fatalf("blank existing: expected ErrProviderAPIKeyRequired, got %v", err)
	}
}
