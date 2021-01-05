import { showThumbnail, hideThumbnail } from './thumbnailManager';
import { getVideoId } from './urlUtils';

const isInYouTube = /(www|m)\.youtube\.com/.test(location.hostname);

export const getAnchorQuery = () => {
  if (isInYouTube) {
    return 'a[href*="youtube.com/watch"],a[href*="youtu.be/"],a[href^="/watch"]';
  }
  return 'a[href*="youtube.com/watch"],a[href*="youtu.be/"]';
};

const handleAnchorMouseEnter = (event) => {
  showThumbnail(getVideoId(event.target.href, true), event.target.getBoundingClientRect());
};

const handleTitleMouseEnter = (event) => {
  showThumbnail(getVideoId(location.href, true), event.target.getBoundingClientRect());
};

const handleMouseLeave = () => {
  hideThumbnail();
};

const addEventListenersToAnchor = (anchorNode) => {
  anchorNode.addEventListener('mouseenter', handleAnchorMouseEnter);
  anchorNode.addEventListener('mouseleave', handleMouseLeave);
};

const removeEventListenersFromAnchor = (anchorNode) => {
  anchorNode.removeEventListener('mouseenter', handleAnchorMouseEnter);
  anchorNode.removeEventListener('mouseleave', handleMouseLeave);
};

const addEventListenersToTitle = (h1Node) => {
  h1Node.addEventListener('mouseenter', handleTitleMouseEnter);
  h1Node.addEventListener('mouseleave', handleMouseLeave);
};

const removeEventListenersFromTitle = (h1Node) => {
  h1Node.removeEventListener('mouseenter', handleTitleMouseEnter);
  h1Node.removeEventListener('mouseleave', handleMouseLeave);
};

const validateAnchor = (anchorNode) => {
  if (!/^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/watch\?|youtu\.be\/)/.test(anchorNode.innerText)) {
    return false;
  }
  const innerTextVideoIdPrefix = getVideoId(anchorNode.innerText, false);
  if (!innerTextVideoIdPrefix) {
    return false;
  }
  const hrefVideoId = getVideoId(anchorNode.href, true);
  return hrefVideoId.startsWith(innerTextVideoIdPrefix);
};

const updateEventListenersForAnchors = (anchorNode) => {
  removeEventListenersFromAnchor(anchorNode);
  if (validateAnchor(anchorNode)) {
    addEventListenersToAnchor(anchorNode);
  }
};

const updateEventListenersForVideoTitle = (h1Node) => {
  removeEventListenersFromTitle(h1Node);
  if (h1Node.classList.contains('title') && h1Node.classList.contains('ytd-video-primary-info-renderer')) {
    addEventListenersToTitle(h1Node);
  }
};

export const findTargetsAndUpdateEventListeners = (parentNode) => {
  for (const anchorNode of parentNode.querySelectorAll(getAnchorQuery())) {
    updateEventListenersForAnchors(anchorNode);
  }
  if (isInYouTube) {
    for (const h1Node of parentNode.querySelectorAll('h1.title.ytd-video-primary-info-renderer')) {
      updateEventListenersForVideoTitle(h1Node);
    }
  }
};

export const updateEventListeners = (node) => {
  if (node.nodeName.toUpperCase() === 'A') {
    updateEventListenersForAnchors(node);
  } else if (isInYouTube && node.nodeName.toUpperCase() === 'H1') {
    updateEventListenersForVideoTitle(node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    findTargetsAndUpdateEventListeners(node);
  }
};
