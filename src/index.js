import { updateEventListenerToAnchors } from './anchorManager';

const handleReceivedChanges = function applyMutations(mutations, observer) {
  for (const mutation of mutations) {
    switch (mutation.type) {
      case 'attributes':
        updateEventListenerToAnchors([mutation.target]);
        break;

      case 'childList':
        updateEventListenerToAnchors(mutation.addedNodes);
        break;

      default:
        break;
    }
  }
};

updateEventListenerToAnchors(
  document.querySelectorAll(
    location.hostname === 'www.youtube.com'
      ? 'a[href*="youtube.com/watch"],a[href*="youtu.be/"],a[href^="/watch"]'
      : 'a[href*="youtube.com/watch"],a[href*="youtu.be/"]'
  )
);

const ob = new MutationObserver(handleReceivedChanges);
const observerOptions = {
  childList: true,
  attributes: true,
  attributeFilter: ['href'],
  subtree: true,
};
ob.observe(document.body, observerOptions);
