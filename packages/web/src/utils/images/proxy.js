const IMAGE_HOSTER_HOST = 'img.commun.com';
const IMAGE_HOSTER_URL = `https://${IMAGE_HOSTER_HOST}`;

function proxyImage(imageUrl, sizePart) {
  let finalSizePart = sizePart;

  try {
    const url = new URL(imageUrl);
    const { protocol, host, pathname, search } = url;

    if (IMAGE_HOSTER_URL.startsWith(protocol) && host === IMAGE_HOSTER_HOST) {
      const match = pathname.match(/^\/images\/(?:(\d+x\d+)\/)?([A-Za-z0-9]+\.[A-Za-z0-9]+)$/);

      if (match) {
        if (!finalSizePart && match[1]) {
          finalSizePart = match[1] || '';
        }

        return `${IMAGE_HOSTER_URL}/images/${finalSizePart}${match[2]}`;
      }

      const matchProxy = pathname.match(/^\/proxy\/(?:(\d+x\d+)\/)?(.*)$/);

      if (matchProxy) {
        if (!finalSizePart && matchProxy[1]) {
          finalSizePart = matchProxy[1] || '';
        }

        return `${IMAGE_HOSTER_URL}/proxy/${finalSizePart}${matchProxy[2]}${search}`;
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Invalid image url (${imageUrl}):`, err);
  }

  return `${IMAGE_HOSTER_URL}/proxy/${finalSizePart}${imageUrl}`;
}

const proxyCache = new Map();

// eslint-disable-next-line import/prefer-default-export
export function proxifyImageUrl(imageUrl, { size } = {}) {
  if (!imageUrl) {
    return null;
  }

  let sizePart = '';

  if (typeof size === 'number') {
    sizePart = `${size}x${size}/`;
  } else if (size) {
    sizePart = `${size}/`;
  }

  const key = `${sizePart}@${imageUrl}`;

  const cached = proxyCache.get(key);

  if (cached) {
    return cached;
  }

  const url = proxyImage(imageUrl, sizePart);

  proxyCache.set(key, url);

  return url;
}
