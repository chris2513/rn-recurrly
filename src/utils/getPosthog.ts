/* Lazily load the PostHog client to avoid registering native views at module
   evaluation time, which can cause duplicate registration errors (RNSVGCircle).
   This module exports a single `getPosthog` function that caches the client. */

let _cached: any = null;

export async function getPosthog() {
    if (_cached) return _cached;
    try {
        const mod = await import('../config/posthog');
        _cached = mod.posthog;
        return _cached;
    } catch (err) {
        if (__DEV__) {
            console.warn('Failed to load PostHog client lazily:', err);
        }
        return null;
    }
}

export default getPosthog;
