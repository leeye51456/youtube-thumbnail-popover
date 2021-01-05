import './thumbnailcomponent.css';

let component = null;
const thumbnails = {
  videoId: '',
  title: null,
  beginning: null,
  middle: null,
  end: null,
};

const createImgElement = (attributes) => {
  const img = document.createElement('img');
  Object.assign(img, attributes);
  return img;
}

const initializeThumbnailComponent = () => {
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

const updateThumbnailComponent = (videoId) => {
  if (videoId === thumbnails.videoId) {
    return component;
  }

  thumbnails.title.src = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
  thumbnails.beginning.src = `https://i.ytimg.com/vi/${videoId}/mq1.jpg`;
  thumbnails.middle.src = `https://i.ytimg.com/vi/${videoId}/mq2.jpg`;
  thumbnails.end.src = `https://i.ytimg.com/vi/${videoId}/mq3.jpg`;
  thumbnails.videoId = videoId;
  return component;
};

export const getThumbnail = (videoId) => {
  if (!component) {
    initializeThumbnailComponent();
  }

  return updateThumbnailComponent(videoId);
};
