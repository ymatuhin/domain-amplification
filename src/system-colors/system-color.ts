import { classes } from "../config";
import { checkBackColorIsSystem } from "./check-back-color-is-system";
import { checkTextColorIsSystem } from "./check-text-color-is-system";

const html = document.documentElement;
export const systemColorDetection = {
  run() {
    const isHtmlSystemBack = checkBackColorIsSystem(document.documentElement);
    const isHtmlSystemText = checkTextColorIsSystem(document.documentElement);
    const isBodySystemBack = checkBackColorIsSystem(document.body);
    const isBodySystemText = checkTextColorIsSystem(document.body);

    if (isHtmlSystemBack) html.classList.add(classes.htmlSystemBack);
    if (isHtmlSystemText) html.classList.add(classes.htmlSystemText);
    if (isBodySystemBack) html.classList.add(classes.bodySystemBack);
    if (isBodySystemText) html.classList.add(classes.bodySystemText);
  },
  clean() {
    html.classList.remove(
      classes.htmlSystemBack,
      classes.htmlSystemText,
      classes.bodySystemBack,
      classes.bodySystemText,
    );
  },
};
