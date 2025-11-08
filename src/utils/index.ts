
// Generates a route path for a given page name.
// Previously this lowercased page names, which broke routing because our <Route path="/Home" />
// definitions are case-sensitive (React Router matches case by default). That caused links like
// createPageUrl("Home") -> /home which didn't match /Home, resulting in blank content on navigation.
// Fix: preserve original casing and just strip spaces (replace with optional hyphen if ever needed).
// We also intentionally leave any query string intact (e.g. "Game?operation=..."), only transforming
// the path segment before the query.
export function createPageUrl(pageName: string) {
    if (!pageName) return '/';
    const [path, query] = pageName.split('?');
    const cleaned = '/' + path.replace(/\s+/g, '');
    return query ? `${cleaned}?${query}` : cleaned;
}