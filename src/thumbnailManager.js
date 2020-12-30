import { getThumbnail } from './thumbnailComponent';

const popoverWidth = 192; // (margin 0) + (padding 16px) + (width 176px)
const popoverHeight = 166.5; // (margin 16px) + (padding 16px) + (gap 4px) + (height 99px) + (height 31.5px)

let thumbnail = null;

export const showThumbnail = function showThumbnailComponent(videoId, anchorRect) {
  const { left, right, top, bottom } = anchorRect;
  const { scrollX, scrollY, innerWidth: viewportWidth, innerHeight: viewportHeight } = window;
  const popoverLeft = (left + popoverWidth < viewportWidth) ? left : (right - popoverWidth);
  const popoverTop = (bottom + popoverHeight < viewportHeight) ? bottom : (top - popoverHeight);
  thumbnail = getThumbnail(videoId);
  thumbnail.style.left = `${scrollX + popoverLeft}px`;
  thumbnail.style.top = `${scrollY + popoverTop}px`;
  document.body.appendChild(thumbnail);
};

export const hideThumbnail = function hideThumbnailComponent() {
  if (thumbnail) {
    thumbnail.remove();
  }
};
