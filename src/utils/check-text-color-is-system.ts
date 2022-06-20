export function checkTextColorIsSystem($element: HTMLElement) {
  document.documentElement.dataset.sdmScheme = "light";
  $element.dataset.sdmScheme = "light";
  const { color: prevColor } = getComputedStyle($element);

  document.documentElement.dataset.sdmScheme = "dark";
  $element.dataset.sdmScheme = "dark";
  const { color: nextColor } = getComputedStyle($element);

  delete document.documentElement.dataset.sdmScheme;
  delete $element.dataset.sdmScheme;

  return prevColor !== nextColor;
}
