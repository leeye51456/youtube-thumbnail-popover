import { findTargetsAndUpdateEventListeners, updateEventListeners } from './eventManager';

const handleReceivedChanges = (mutations, observer) => {
  const hoveredAnchor = document.querySelector('a:hover');
  for (const mutation of mutations) {
    switch (mutation.type) {
      case 'attributes':
        updateEventListeners(mutation.target, hoveredAnchor);
        break;

      case 'childList':
        for (const node of mutation.addedNodes) {
          updateEventListeners(node, hoveredAnchor);
        }
        break;

      default:
        break;
    }
  }
};

findTargetsAndUpdateEventListeners(document);

const ob = new MutationObserver(handleReceivedChanges);
const observerOptions = {
  childList: true,
  attributes: true,
  attributeFilter: ['href'],
  subtree: true,
};
ob.observe(document.body, observerOptions);
