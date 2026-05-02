export interface OAuthProviderConfig { clientId: string; clientSecret: string; callbackUrl: string; }

export interface OAuthProviders {
  google: OAuthProviderConfig;
  github: OAuthProviderConfig;
}

export function buildOAuthStartUrl(provider: "google" | "github", cfg: OAuthProviders, state: string): string {
  const c = cfg[provider];
  const base = provider === "google" ? "https://accounts.google.com/o/oauth2/v2/auth" : "https://github.com/login/oauth/authorize";
  return `${base}?client_id=${encodeURIComponent(c.clientId)}&redirect_uri=${encodeURIComponent(c.callbackUrl)}&response_type=code&scope=openid%20email%20profile&state=${encodeURIComponent(state)}`;
}
