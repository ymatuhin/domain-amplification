export function checkTextColorIsSystem($element: HTMLElement) {
  document.documentElement.dataset.daScheme = "light";
  $element.dataset.daScheme = "light";
  const { color: prevColor } = getComputedStyle($element);

  document.documentElement.dataset.daScheme = "dark";
  $element.dataset.daScheme = "dark";
  const { color: nextColor } = getComputedStyle($element);

  delete document.documentElement.dataset.daScheme;
  delete $element.dataset.daScheme;

  return prevColor !== nextColor;
}
