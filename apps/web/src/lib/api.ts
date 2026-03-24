const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is NOT defined, falling back to http://localhost:8000");
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  // Ensure we don't have double slashes if path starts with / and API_BASE_URL ends with /
  const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;
  console.log(`[API Client] Requesting: ${url}`);

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "No error body");
      throw new Error(`API request failed: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    console.error(`Fetch error for ${url}:`, err);
    throw err;
  }
}
