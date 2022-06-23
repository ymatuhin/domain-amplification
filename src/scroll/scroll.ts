import { classes, logger } from "../config";

const log = logger("custom-scroll");

export const initCustomScroll = () => {
  const { documentElement: html } = document;
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
