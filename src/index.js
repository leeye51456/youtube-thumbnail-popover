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

const addMouseEventListener = function addMouseEventListenerToAnchor(anchor) {
  anchor.addEventListener('mouseenter', handleMouseEnter);
  anchor.addEventListener('mouseleave', handleMouseLeave);
};

const isAnchor = function isAnchorWithHrefAndText(node) {
  return node.nodeName.toUpperCase() === 'A' && node.href && node.innerText;
};
const isAnchorToYouTube = function isAnchorToYouTubeVideo(node) {
  return /(youtube\.com\/watch|youtu\.be\/)/.test(node.href);
};
const hasSameHrefAndText = function hasSameHrefAndText(node) {
  const innerText = node.innerText.replace(/^https?:\/\/(m\.|www\.)?/, '').slice(0, 25);
  const href = node.href.replace(/^https?:\/\/(m\.|www\.)?/, '').slice(0, 25);
  return innerText === href;
};

const addEventListenerToAnchors = function addEventListenerToAnchorNodes(nodes) {
  for (const node of nodes) {
    if (isAnchor(node) && isAnchorToYouTube(node) && hasSameHrefAndText(node)) {
      addMouseEventListener(node);
    }
  }
};

const handleReceivedChanges = function applyMutations(mutations, observer) {
  for (const { addedNodes } of mutations) {
    addEventListenerToAnchors(addedNodes);
  }
};

addEventListenerToAnchors(document.querySelectorAll('a[href*="youtube.com/watch"], a[href*="youtu.be/"]'));

const ob = new MutationObserver(handleReceivedChanges);
const observerOptions = {
  childList: true,
  subtree: true,
};
ob.observe(document.body, observerOptions);
