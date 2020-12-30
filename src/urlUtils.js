const shortUrlPathnameId = /^\/([0-9A-Za-z_-]{11})/;
const shortUrlPathnameIdPrefix = /^\/([0-9A-Za-z_-]{1,11})/;

const fullUrlIdQuery = /^([0-9A-Za-z_-]{11})/;
const fullUrlIdQueryPrefix = /^([0-9A-Za-z_-]{1,11})/;

const getUrlWithHttps = function supposeProtocolOfUrlHttps(urlString) {
  if (!urlString.startsWith('https://')) {
    return urlString.replace(/^(.+:\/\/)?/, 'https://');
  }
  return urlString;
};

export const getVideoId = function getYouTubeVideoIdFromUrl(urlString, strict) {
  const url = new URL(getUrlWithHttps(urlString.startsWith('/') ? location.host + urlString : urlString));
  const { hostname, pathname, searchParams } = url;

  let matches;
  if (hostname === 'youtu.be') {
    matches = (strict ? shortUrlPathnameId : shortUrlPathnameIdPrefix).exec(pathname);
  } else if (/^((www|m)\.)?youtube\.com$/.test(hostname) && pathname.startsWith('/watch') && searchParams.has('v')) {
    matches = (strict ? fullUrlIdQuery : fullUrlIdQueryPrefix).exec(searchParams.get('v'));
  } else {
    return null;
  }
  return matches ? matches[1] : null;
};
