import getCssSelector from "css-selector-generator";

export function getSelector(element: HTMLElement) {
  return getCssSelector(element, {
    combineWithinSelector: false,
    combineBetweenSelectors: false,
    maxCombinations: 1,
    maxCandidates: 1,
  });
}
