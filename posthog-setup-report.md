<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the RN subscription management app (Expo / React Native 0.81.5 with Clerk auth and Expo Router).

## Summary of changes

- **`app.config.js`** (new) — Converted `app.json` to a JS config to support runtime environment variable injection. Adds `extra.posthogProjectToken` and `extra.posthogHost` from `.env`.
- **`src/config/posthog.ts`** (new) — PostHog client singleton using `expo-constants` to read config from `app.config.js` extras. Configured with batching, lifecycle events, feature flags, and debug logging in dev.
- **`app/_layout.tsx`** — Added `PostHogProvider` wrapping the `Stack`, with `autocapture` for touch events. Added manual screen tracking via `useEffect` on `usePathname` / `useGlobalSearchParams` (required for Expo Router).
- **`app/(auth)/sign-in.tsx`** — Added `posthog.identify()` and `user_signed_in` capture on successful sign-in. Added `user_sign_in_failed` capture on error.
- **`app/(auth)/sign-up.tsx`** — Added `posthog.identify()` (with `$set_once: { signup_date }`) and `user_signed_up` capture on successful sign-up. Added `user_sign_up_failed` capture on error.
- **`app/(tabs)/settings.tsx`** — Added `user_signed_out` capture and `posthog.reset()` before Clerk `signOut()`.
- **`app/(tabs)/index.tsx`** — Added `subscription_expanded` capture when a subscription card is expanded, with `subscription_id` and `subscription_name` properties.
- **`app/subscriptions/[id].tsx`** — Added `subscription_detail_viewed` capture on mount, with `subscription_id` property.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- **`package.json`** — Added `posthog-react-native`, `expo-file-system`, `expo-application`, `expo-device`, `expo-localization`, `react-native-svg`.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in via Clerk | `app/(auth)/sign-in.tsx` |
| `user_sign_in_failed` | Sign-in attempt failed with error | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | User successfully created a new account | `app/(auth)/sign-up.tsx` |
| `user_sign_up_failed` | Sign-up attempt failed with error | `app/(auth)/sign-up.tsx` |
| `user_signed_out` | User signed out from settings screen | `app/(tabs)/settings.tsx` |
| `subscription_expanded` | Subscription card expanded on home screen | `app/(tabs)/index.tsx` |
| `subscription_detail_viewed` | Subscription detail screen opened | `app/subscriptions/[id].tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/157466/dashboard/616005
- **Sign-up → Sign-in → Subscription Engagement Funnel**: https://eu.posthog.com/project/157466/insights/BWA2Xk1J
- **Daily Sign-ins & Sign-ups**: https://eu.posthog.com/project/157466/insights/HmGMK9zH
- **Auth Failure Rate**: https://eu.posthog.com/project/157466/insights/dPLBGtzY
- **Subscription Engagement**: https://eu.posthog.com/project/157466/insights/zFWe7LVj
- **User Sign-out (Churn Signal)**: https://eu.posthog.com/project/157466/insights/uEqxsabD

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
