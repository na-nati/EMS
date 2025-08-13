/* Centralized API client with auto-refresh on 401 using httpOnly refresh cookie */

type ApiRequestOptions = RequestInit & { rawUrl?: boolean };

const getApiBaseUrl = (): string => {
    const base = import.meta.env.VITE_API_URL as string | undefined;
    return base ?? '';
};

const ACCESS_TOKEN_KEY = 'ems_token';

let refreshInFlight: Promise<string | null> | null = null;
let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorized = (cb: () => void) => {
    onUnauthorizedCallback = cb;
};

export const getAccessToken = (): string | null => {
    try {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
        return null;
    }
};

export const setAccessToken = (token: string | null) => {
    try {
        if (token) {
            localStorage.setItem(ACCESS_TOKEN_KEY, token);
        } else {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
    } catch {
        // ignore
    }
};

export const refreshAccessToken = async (): Promise<string | null> => {
    if (refreshInFlight) return refreshInFlight;

    const apiBaseUrl = getApiBaseUrl();
    refreshInFlight = (async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/users/refresh-token`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                setAccessToken(null);
                return null;
            }

            const data = await response.json();
            const newToken = data?.token as string | undefined;
            if (newToken) setAccessToken(newToken);
            return newToken ?? null;
        } catch {
            setAccessToken(null);
            return null;
        } finally {
            refreshInFlight = null;
        }
    })();

    return refreshInFlight;
};

const buildUrl = (url: string, rawUrl?: boolean): string => {
    if (rawUrl) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const base = getApiBaseUrl();
    if (!base) return url; // fallback
    // Ensure no double slashes
    return `${base.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

export const apiRequest = async (url: string, options: ApiRequestOptions = {}): Promise<any> => {
    const { headers, rawUrl, ...rest } = options;
    const finalUrl = buildUrl(url, rawUrl);

    const token = getAccessToken();
    const mergedHeaders: HeadersInit = {
        ...(headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // If body is plain object and no explicit Content-Type, set JSON
    const isFormData = typeof FormData !== 'undefined' && rest.body instanceof FormData;
    if (!isFormData && rest.body && !(mergedHeaders as Record<string, string>)['Content-Type']) {
        (mergedHeaders as Record<string, string>)['Content-Type'] = 'application/json';
    }

    const doFetch = async (): Promise<Response> => {
        return fetch(finalUrl, {
            ...rest,
            headers: mergedHeaders,
        });
    };

    let response = await doFetch();
    if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) {
            if (onUnauthorizedCallback) onUnauthorizedCallback();
            throw new Error('Unauthorized');
        }
        // Retry with new token
        const retryHeaders: HeadersInit = {
            ...mergedHeaders,
            Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(finalUrl, {
            ...rest,
            headers: retryHeaders,
        });
    }

    if (!response.ok) {
        let message = `HTTP error! status: ${response.status}`;
        try {
            const err = await response.json();
            if (err?.message) message = err.message;
        } catch {
            // ignore
        }
        throw new Error(message);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return response.json();
    }
    return response.text();
};


