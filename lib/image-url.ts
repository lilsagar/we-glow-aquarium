export function getSafeImageUrl(url?: string): string {
  const trimmed = url?.trim();
  if (!trimmed) return "/placeholder.png";
  if (trimmed.includes("images.unsplash.com")) return "/placeholder.png";
  return trimmed;
}
