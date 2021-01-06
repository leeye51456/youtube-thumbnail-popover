const shortUrlPathnameId = /^\/([0-9A-Za-z_-]{11})/;
const shortUrlPathnameIdPrefix = /^\/([0-9A-Za-z_-]{1,11})/;

const fullUrlIdQuery = /^([0-9A-Za-z_-]{11})/;
const fullUrlIdQueryPrefix = /^([0-9A-Za-z_-]{1,11})/;

const getUrlWithHttps = (urlString) => {
  if (!urlString.startsWith('https://')) {
    return urlString.replace(/^(.+:\/\/)?/, 'https://');
  }
  return urlString;
};

const isFullYouTubeUrl = (url) => {
  const { hostname, pathname, searchParams } = url;
  return (
    /^((www|m)\.)?youtube\.com$/.test(hostname)
      && pathname.startsWith('/watch')
      && searchParams.has('v')
  );
};

export const getVideoId = (urlString, strict) => {
  if (!urlString) {
    return null;
  }

  let url;
  try {
    url = new URL(getUrlWithHttps(urlString.startsWith('/') ? location.host + urlString : urlString));
  } catch (error) {
    return null;
  }

  let matches;
  if (url.hostname === 'youtu.be') {
    matches = (strict ? shortUrlPathnameId : shortUrlPathnameIdPrefix).exec(url.pathname);
  } else if (isFullYouTubeUrl(url)) {
    matches = (strict ? fullUrlIdQuery : fullUrlIdQueryPrefix).exec(url.searchParams.get('v'));
  } else {
    return null;
  }
  return matches ? matches[1] : null;
};
