import { classes } from "../config";
import { waitForBody } from "../dom";
import { checkBackColorIsSystem } from "./check-back-color-is-system";
import { checkTextColorIsSystem } from "./check-text-color-is-system";

export const checkSystemColors = async () => {
  const html = document.documentElement;
  await waitForBody();
  const isHtmlSystemBack = checkBackColorIsSystem(document.documentElement);
  const isHtmlSystemText = checkTextColorIsSystem(document.documentElement);
  const isBodySystemBack = checkBackColorIsSystem(document.body);
  const isBodySystemText = checkTextColorIsSystem(document.body);

  if (isHtmlSystemBack) html.classList.add(classes.htmlSystemBack);
  if (isHtmlSystemText) html.classList.add(classes.htmlSystemText);
  if (isBodySystemBack) html.classList.add(classes.bodySystemBack);
  if (isBodySystemText) html.classList.add(classes.bodySystemText);
};
