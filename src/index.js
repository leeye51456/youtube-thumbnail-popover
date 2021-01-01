import { getAnchorQuery, updateEventListenerToAnchors } from './anchorManager';

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

updateEventListenerToAnchors(document.querySelectorAll(getAnchorQuery()));

const ob = new MutationObserver(handleReceivedChanges);
const observerOptions = {
  childList: true,
  attributes: true,
  attributeFilter: ['href'],
  subtree: true,
};
ob.observe(document.body, observerOptions);
