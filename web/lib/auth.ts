// Tiny client-side session store. The JWT lives in localStorage; components
// listen for the "authchange" event to re-render when login state changes.

const TOKEN_KEY = "tbp_token";
const EMAIL_KEY = "tbp_email";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EMAIL_KEY);
}

export function setSession(token: string, email: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, email);
  window.dispatchEvent(new Event("authchange"));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
  window.dispatchEvent(new Event("authchange"));
}

// Ask the (single, layout-level) AuthModal to open.
export function openAuth(mode: "login" | "register" = "login") {
  window.dispatchEvent(new CustomEvent("open-auth", { detail: mode }));
}
