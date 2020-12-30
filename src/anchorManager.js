import { showThumbnail, hideThumbnail } from './thumbnailManager';
import { getVideoId } from './urlUtils';

const handleMouseEnter = function handleMouseEnterToAnchor(event) {
  if (/(www\.|m\.)?youtube\.com\/watch\?|youtu\.be\/.+/.test(event.target.href)) {
    showThumbnail(getVideoId(event.target.href, true), event.target.getBoundingClientRect());
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

const removeMouseEventListener = function removeMouseEventListenerFromAnchor(anchor) {
  anchor.removeEventListener('mouseenter', handleMouseEnter);
  anchor.removeEventListener('mouseleave', handleMouseLeave);
};

const isTextAnchor = function isAnchorWithHrefAndText(node) {
  return node.nodeName.toUpperCase() === 'A' && node.href && node.innerText;
};
const validateAnchor = function hasHrefAndTextEquivalentUrl(node) {
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

export const updateEventListenerToAnchors = function updateEventListenerToAnchorNodes(nodes) {
  for (const node of nodes) {
    removeMouseEventListener(node);
    if (isTextAnchor(node) && validateAnchor(node)) {
      addMouseEventListener(node);
    }
  }
};
