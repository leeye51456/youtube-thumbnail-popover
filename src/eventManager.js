import { showThumbnail, hideThumbnail } from './thumbnailManager';
import { getVideoId } from './urlUtils';

const isInYouTube = /(www|m)\.youtube\.com/.test(location.hostname);
const anchorQuery = `a[href*="youtube.com/watch"],a[href*="youtu.be/"]${isInYouTube ? ',a[href^="/watch"]' : ''}`;

const handleAnchorMouseEnter = (event) => {
  showThumbnail(getVideoId(event.target.href, true), event.target.getBoundingClientRect());
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

export const findTargetsAndUpdateEventListeners = (parentNode) => {
  for (const anchorNode of parentNode.querySelectorAll(anchorQuery)) {
    updateEventListenersForAnchors(anchorNode);
  }
};

export const updateEventListeners = (node) => {
  if (node.nodeName.toUpperCase() === 'A') {
    updateEventListenersForAnchors(node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    findTargetsAndUpdateEventListeners(node);
  }
};
