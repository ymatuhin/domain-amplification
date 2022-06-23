import { classes, log } from "../config";

const { documentElement: html } = document;
export const initCustomScroll = () => {
  log("initCustomScroll");
  chrome.storage.sync.get(
    ["customScroll", "defaultCustomScroll"],
    ({ customScroll, defaultCustomScroll }) => {
      log("initCustomScroll", { customScroll, defaultCustomScroll });

      if (customScroll) html.classList.add(classes.customScrollOn);
      else html.classList.remove(classes.customScrollOn);

      if (defaultCustomScroll)
        html.classList.add(classes.defaultCustomScrollOn);
      else html.classList.remove(classes.defaultCustomScrollOn);
    },
  );
};
