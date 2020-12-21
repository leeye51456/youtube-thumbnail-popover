let component = null;
const thumbnails = {
  videoId: '',
  title: null,
};

const initializeThumbnail = function initializeThumbnailComponent() {
  const container = document.createElement('div');
  container.className = 'ytpext-thumbnail-container';

  thumbnails.title = document.createElement('img');
  thumbnails.title.className = 'ytpext-thumbnail-title';
  container.appendChild(thumbnails.title);

  component = container;
}

const updateThumbnail = function updateThumbnailComponent(videoId) {
  if (videoId === thumbnails.videoId) {
    return component;
  }

  thumbnails.title.src = `https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp`;
  thumbnails.videoId = videoId;
  return component;
};

export const getThumbnail = function createOrUpdateThumbnailComponent(videoId) {
  if (!component) {
    initializeThumbnail();
  }

  return updateThumbnail(videoId);
};
