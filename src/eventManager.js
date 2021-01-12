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

const addEventListenersToAnchor = (anchorNode, hoveredAnchor) => {
  anchorNode.addEventListener('mouseenter', handleAnchorMouseEnter);
  anchorNode.addEventListener('mouseleave', handleMouseLeave);
  if (hoveredAnchor === anchorNode) {
    anchorNode.dispatchEvent(new MouseEvent('mouseenter'));
  }
};

const removeEventListenersFromAnchor = (anchorNode, hoveredAnchor) => {
  if (hoveredAnchor === anchorNode) {
    anchorNode.dispatchEvent(new MouseEvent('mouseleave'));
  }
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
  if (!hrefVideoId) {
    return false;
  }
  return hrefVideoId.startsWith(innerTextVideoIdPrefix);
};

const updateEventListenersForAnchors = (anchorNode, hoveredAnchor) => {
  removeEventListenersFromAnchor(anchorNode, hoveredAnchor);
  if (validateAnchor(anchorNode)) {
    addEventListenersToAnchor(anchorNode, hoveredAnchor);
  }
};

export const findTargetsAndUpdateEventListeners = (parentNode, hoveredAnchor) => {
  for (const anchorNode of parentNode.querySelectorAll(anchorQuery)) {
    updateEventListenersForAnchors(anchorNode, hoveredAnchor);
  }
};

export const updateEventListeners = (node, hoveredAnchor) => {
  if (node.nodeName.toUpperCase() === 'A') {
    updateEventListenersForAnchors(node, hoveredAnchor);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    findTargetsAndUpdateEventListeners(node, hoveredAnchor);
  }
};
