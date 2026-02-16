export function pureURL(url: URL) {
  const { origin, pathname } = new URL(url);
  return `${origin}${pathname}`;
}
