export function analyzeUserAgent(userAgent) {
  const ua = userAgent.toLowerCase();
  const clientType = 'web';
  let platform;
  let deviceType;

  if (/android/.test(ua)) {
    platform = 'android';
  } else if (/iphone|ipod|ipad|ios/.test(ua)) {
    platform = 'ios';
  } else {
    platform = 'desktop';
  }

  if (platform === 'android' || platform === 'ios') {
    if (window.outerWidth >= 768) {
      deviceType = 'tablet';
    } else {
      deviceType = 'phone';
    }
  } else {
    deviceType = 'desktop';
  }

  return {
    platform,
    deviceType,
    clientType,
  };
}

export function toQueryString(data) {
  const pairs = [];

  for (const key of Object.keys(data)) {
    pairs.push(`${key}=${encodeURIComponent(data[key])}`);
  }

  return pairs.join('&');
}
