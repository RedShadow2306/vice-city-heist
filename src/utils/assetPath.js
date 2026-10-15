/**
 * assetPath.js
 * Automatically resolves public asset paths according to Vite's configured base URL.
 * Works seamlessly in both local development ('/') and GitHub Pages deployment ('/vice-city-heist/').
 */

export function getAssetUrl(path) {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}

export default getAssetUrl;
