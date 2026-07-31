import { useState, useEffect } from './vendor/preact-standalone.mjs';

// Hash routing rather than the History API: it needs no server rewrites, works
// from any subpath, and avoids the History quirks iOS has in standalone mode.

export const DEFAULT_ROUTE = '#/splash';

export const ROUTES = {
  splash: '#/splash',
  onboarding: '#/onboarding',
  login: '#/login',
  loading: '#/loading',
  home: '#/home',
  contacts: '#/contacts',
  chat: '#/chat/group',
};

export function useHashRoute() {
  const [route, setRoute] = useState(() => location.hash || DEFAULT_ROUTE);
  useEffect(() => {
    const onChange = () => setRoute(location.hash || DEFAULT_ROUTE);
    addEventListener('hashchange', onChange);
    return () => removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export const go = route => { location.hash = route; };

// Replaces the history entry instead of adding one, so the back gesture never
// lands the user back on the splash screen.
export const replace = route => { location.replace(route); };
