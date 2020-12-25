import './thumbnailcomponent.css';

let component = null;
const thumbnails = {
  videoId: '',
  title: null,
  beginning: null,
  middle: null,
  end: null,
};

const createImgElement = function createImgElementWithAttributes({ width, height, className }) {
  const img = document.createElement('img');
  img.width = width;
  img.height = height;
  img.className = className;
  return img;
}

const initializeThumbnail = function initializeThumbnailComponent() {
  const container = document.createElement('div');
  container.className = 'ytpext-thumbnail-container';

  thumbnails.title = createImgElement({ width: 320, height: 180, className: 'ytpext-thumbnail-title'});
  container.appendChild(thumbnails.title);
  for (const name of ['beginning', 'middle', 'end']) {
    thumbnails[name] = createImgElement({ width: 320, height: 180, className: 'ytpext-thumbnail-part'});
    container.appendChild(thumbnails[name]);
  }

  component = container;
}

const updateThumbnail = function updateThumbnailComponent(videoId) {
  if (videoId === thumbnails.videoId) {
    return component;
  }

  thumbnails.title.src = `https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp`;
  thumbnails.beginning.src = `https://i.ytimg.com/vi_webp/${videoId}/mq1.webp`;
  thumbnails.middle.src = `https://i.ytimg.com/vi_webp/${videoId}/mq2.webp`;
  thumbnails.end.src = `https://i.ytimg.com/vi_webp/${videoId}/mq3.webp`;
  thumbnails.videoId = videoId;
  return component;
};

export const getThumbnail = function createOrUpdateThumbnailComponent(videoId) {
  if (!component) {
    initializeThumbnail();
  }

  return updateThumbnail(videoId);
};
