export function urlFactory(
  baseUrl: string,
  params: Record<string, any> = {},
): string {
  const paramsStr: string[] = [];
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      paramsStr.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });
  const queryString = paramsStr.join('&');
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
