import { getThumbnail } from './thumbnailComponent';

const popoverWidth = 336;
const popoverHeight = 212;

let thumbnail = null;

const showThumbnail = function showThumbnailComponent(videoId, anchorRect) {
  const { left, right, top, bottom } = anchorRect;
  const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;
  const popoverLeft = (left + popoverWidth < viewportWidth) ? left : (right - popoverWidth);
  const popoverTop = (bottom + popoverHeight < viewportHeight) ? bottom : (top - popoverHeight);
  thumbnail = getThumbnail(videoId);
  thumbnail.style.left = `${popoverLeft}px`;
  thumbnail.style.top = `${popoverTop}px`;
  document.body.appendChild(thumbnail);
};

const hideThumbnail = function hideThumbnailComponent() {
  if (thumbnail) {
    thumbnail.remove();
    thumbnail.style.left = '';
    thumbnail.style.top = '';
  }
};

const getUrlWithHttps = function supposeProtocolOfUrlHttps(url) {
  if (!/^https:\/\//.test(url)) {
    return url.replace(/^(.+:\/\/)?/, 'https://');
  }
  return url;
};

const getVideoId = function getYouTubeVideoIdFromUrl(url) {
  const urlObject = new URL(getUrlWithHttps(url));
  const { hostname, pathname, searchParams } = urlObject;

  if (hostname === 'youtu.be') {
    const matches = /^\/([0-9A-Za-z_-]+)/.exec(pathname);
    return matches ? matches[1] : null;
  } else if (/^((www|m)\.)?youtube\.com$/.test(hostname) && pathname.startsWith('/watch') && searchParams.has('v')) {
    return searchParams.get('v').replace(/[^0-9A-Za-z_-]+/, '');
  } else {
    return null;
  }
};

const handleMouseEnter = function handleMouseEnterToAnchor(event) {
  // TODO - Check whether href attribute is correct YouTube video URL,
  //        and remove event listener if not YouTube video URL.

  showThumbnail(getVideoId(event.target.href), event.target.getBoundingClientRect());
};

const handleMouseLeave = function handleMouseLeaveFromAnchor() {
  hideThumbnail();
};

const addEventListenerToAnchor = function addMouseEventListenerToAnchor(anchor) {
  anchor.addEventListener('mouseenter', handleMouseEnter);
  anchor.addEventListener('mouseleave', handleMouseLeave);
};

document.querySelectorAll('a[href*="youtube.com/watch"], a[href*="youtu.be/"]')
  .forEach(addEventListenerToAnchor);
