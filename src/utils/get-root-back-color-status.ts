import { checkBackColorIsSystem } from "./check-back-color-is-system";

export function getRootBackColorStatus() {
  const isSystemBgHtml = checkBackColorIsSystem(document.documentElement);
  const isSystemBgBody = checkBackColorIsSystem(document.body);

  if (isSystemBgHtml && isSystemBgBody) return "both";
  else if (isSystemBgHtml) return "html";
  else if (isSystemBgBody) return "body";
  return "none";
}
