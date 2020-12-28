import { getThumbnail } from './thumbnailComponent';

const popoverWidth = 192; // (margin 0) + (padding 16px) + (width 176px)
const popoverHeight = 166.5; // (margin 16px) + (padding 16px) + (gap 4px) + (height 99px) + (height 31.5px)

let thumbnail = null;

const showThumbnail = function showThumbnailComponent(videoId, anchorRect) {
  const { left, right, top, bottom } = anchorRect;
  const { scrollX, scrollY, innerWidth: viewportWidth, innerHeight: viewportHeight } = window;
  const popoverLeft = (left + popoverWidth < viewportWidth) ? left : (right - popoverWidth);
  const popoverTop = (bottom + popoverHeight < viewportHeight) ? bottom : (top - popoverHeight);
  thumbnail = getThumbnail(videoId);
  thumbnail.style.left = `${scrollX + popoverLeft}px`;
  thumbnail.style.top = `${scrollY + popoverTop}px`;
  document.body.appendChild(thumbnail);
};

const hideThumbnail = function hideThumbnailComponent() {
  if (thumbnail) {
    thumbnail.remove();
    thumbnail.style.left = '';
    thumbnail.style.top = '';
  }
};

const getUrlWithHttps = function supposeProtocolOfUrlHttps(urlString) {
  if (!urlString.startsWith('https://')) {
    return urlString.replace(/^(.+:\/\/)?/, 'https://');
  }
  return urlString;
};

const getVideoId = function getYouTubeVideoIdFromUrl(urlString) {
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

const handleMouseEnter = function handleMouseEnterToAnchor(event) {
  if (/(www\.|m\.)?youtube\.com\/watch\?|youtu\.be\/.+/.test(event.target.href)) {
    showThumbnail(getVideoId(event.target.href), event.target.getBoundingClientRect());
  } else {
    event.target.removeEventListener('mouseenter', handleMouseEnter);
    event.target.removeEventListener('mouseleave', handleMouseLeave);
  }
};

const handleMouseLeave = function handleMouseLeaveFromAnchor() {
  hideThumbnail();
};

const addMouseEventListener = function addMouseEventListenerToAnchor(anchor) {
  anchor.addEventListener('mouseenter', handleMouseEnter);
  anchor.addEventListener('mouseleave', handleMouseLeave);
};

const isTextAnchor = function isAnchorWithHrefAndText(node) {
  return node.nodeName.toUpperCase() === 'A' && node.href && node.innerText;
};
const validateAnchor = function hasHrefAndTextEquivalentUrl(node) {
  if (!/^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/watch\?|youtu\.be\/)/.test(node.innerText)) {
    return false;
  }
  const innerTextVideoId = getVideoId(node.innerText);
  if (!innerTextVideoId) {
    return false;
  }
  const hrefVideoId = getVideoId(node.href);
  return hrefVideoId.startsWith(innerTextVideoId);
};

const addEventListenerToAnchors = function addEventListenerToAnchorNodes(nodes) {
  for (const node of nodes) {
    if (isTextAnchor(node) && validateAnchor(node)) {
      addMouseEventListener(node);
    }
  }
};

const handleReceivedChanges = function applyMutations(mutations, observer) {
  for (const mutation of mutations) {
    switch (mutation.type) {
      case 'childList':
        addEventListenerToAnchors(mutation.addedNodes);
        break;

      default:
        break;
    }
  }
};

addEventListenerToAnchors(
  document.querySelectorAll(
    location.hostname === 'www.youtube.com'
      ? 'a[href*="youtube.com/watch"],a[href*="youtu.be/"],a[href^="/watch"]'
      : 'a[href*="youtube.com/watch"],a[href*="youtu.be/"]'
  )
);

const ob = new MutationObserver(handleReceivedChanges);
// FIXME - Whenever `href` attribute of `<a>` element changes, its event listener should be added or removed.
const observerOptions = {
  childList: true,
  subtree: true,
};
ob.observe(document.body, observerOptions);
