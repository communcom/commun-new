export function analyzeUserAgent(userAgent, isWebView) {
  const ua = userAgent.toLowerCase();
  let clientType = 'web';
  let platform;
  let deviceType;

  if (isWebView) {
    clientType = 'web-view';
  }

  if (/android/.test(ua)) {
    platform = 'android';
  } else if (/iphone|ipod|ipad|ios/.test(ua)) {
    platform = 'ios';
  } else {
    platform = 'desktop';
  }

  if (platform === 'android' || platform === 'ios') {
    const width = Math.min(window.innerWidth, window.innerHeight);

    if (width >= 500) {
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
