import { isSystemBgColor } from "./is-system-bg-color";

export function getRootBackColorStatus() {
  const isSystemBgHtml = isSystemBgColor(document.documentElement);
  const isSystemBgBody = isSystemBgColor(document.body);

  if (isSystemBgHtml && isSystemBgBody) return "both";
  else if (isSystemBgHtml) return "html";
  else if (isSystemBgBody) return "body";
  return "none";
}
