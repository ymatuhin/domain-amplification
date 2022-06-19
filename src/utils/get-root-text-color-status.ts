import { checkTextColorIsSystem } from "./check-text-color-is-system";

export function getRootTextColorStatus() {
  const isSystemTextHtml = checkTextColorIsSystem(document.documentElement);
  const isSystemTextBody = checkTextColorIsSystem(document.body);

  if (isSystemTextHtml && isSystemTextBody) return "both";
  else if (isSystemTextHtml) return "html";
  else if (isSystemTextBody) return "body";
  return "none";
}
