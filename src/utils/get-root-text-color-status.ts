import { isSystemTextColor } from "./is-system-text-color";

export function getRootTextColorStatus() {
  const isSystemTextHtml = isSystemTextColor(document.documentElement);
  const isSystemTextBody = isSystemTextColor(document.body);

  if (isSystemTextHtml && isSystemTextBody) return "both";
  else if (isSystemTextHtml) return "html";
  else if (isSystemTextBody) return "body";
  return "none";
}
