const getUrlWithHttps = function supposeProtocolOfUrlHttps(urlString) {
  if (!urlString.startsWith('https://')) {
    return urlString.replace(/^(.+:\/\/)?/, 'https://');
  }
  return urlString;
};

export const getVideoId = function getYouTubeVideoIdFromUrl(urlString) {
  const url = new URL(getUrlWithHttps(urlString.startsWith('/') ? location.host + urlString : urlString));
  const { hostname, pathname, searchParams } = url;

  if (hostname === 'youtu.be') {
    const matches = /^\/([0-9A-Za-z_-]+)/.exec(pathname);
    return matches ? matches[1] : null;
  } else if (/^((www|m)\.)?youtube\.com$/.test(hostname) && pathname.startsWith('/watch') && searchParams.has('v')) {
    return searchParams.get('v').replace(/[^0-9A-Za-z_-]+/, '');
  } else {
    return null;
  }
};
