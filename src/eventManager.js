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

const handleAnchorMouseLeave = () => {
  hideThumbnail();
};

const addEventListenersToAnchor = (anchor) => {
  anchor.addEventListener('mouseenter', handleAnchorMouseEnter);
  anchor.addEventListener('mouseleave', handleAnchorMouseLeave);
};

const removeEventListenersFromAnchor = (anchor) => {
  anchor.removeEventListener('mouseenter', handleAnchorMouseEnter);
  anchor.removeEventListener('mouseleave', handleAnchorMouseLeave);
};

const isTextAnchor = (node) => {
  return node.nodeName.toUpperCase() === 'A' && node.href && node.innerText;
};
const validateAnchor = (node) => {
  if (!/^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/watch\?|youtu\.be\/)/.test(node.innerText)) {
    return false;
  }
  const innerTextVideoIdPrefix = getVideoId(node.innerText, false);
  if (!innerTextVideoIdPrefix) {
    return false;
  }
  const hrefVideoId = getVideoId(node.href, true);
  return hrefVideoId.startsWith(innerTextVideoIdPrefix);
};

export const updateEventListenerToAnchors = (nodes) => {
  for (const node of nodes) {
    if (isTextAnchor(node)) {
      removeEventListenersFromAnchor(node);
      if (validateAnchor(node)) {
        addEventListenersToAnchor(node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      updateEventListenerToAnchorNodes(node.querySelectorAll(getAnchorQuery()));
    }
  }
};
