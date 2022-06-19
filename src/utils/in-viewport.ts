export function isInViewport(element: Element) {
  return getViewPercentage(element) !== 0;
}

// From: https://gist.github.com/rijkvanzanten/df73ae28e80b9c6e5030baed4d1a90a6
function getViewPercentage(element: Element) {
  const viewport = {
    top: window.pageYOffset,
    bottom: window.pageYOffset + window.innerHeight,
  };

  const elementBoundingRect = element.getBoundingClientRect();
  const elementPos = {
    top: elementBoundingRect.y + window.pageYOffset,
    bottom:
      elementBoundingRect.y + elementBoundingRect.height + window.pageYOffset,
  };

  if (viewport.top > elementPos.bottom || viewport.bottom < elementPos.top) {
    return 0;
  }

  // Element is fully within viewport
  if (viewport.top < elementPos.top && viewport.bottom > elementPos.bottom) {
    return 100;
  }

  // Element is bigger than the viewport
  if (elementPos.top < viewport.top && elementPos.bottom > viewport.bottom) {
    return 100;
  }

  const elementHeight = elementBoundingRect.height;
  let elementHeightInView = elementHeight;

  if (elementPos.top < viewport.top) {
    elementHeightInView = elementHeight - (window.pageYOffset - elementPos.top);
  }

  if (elementPos.bottom > viewport.bottom) {
    elementHeightInView =
      elementHeightInView - (elementPos.bottom - viewport.bottom);
  }

  const percentageInView = (elementHeightInView / window.innerHeight) * 100;

  return Math.round(percentageInView);
}
