// eslint-disable-next-line import/prefer-default-export
export function resetCookies(cookies) {
  for (const cookie of cookies) {
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
