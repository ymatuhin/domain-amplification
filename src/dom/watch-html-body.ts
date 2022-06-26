import { logger } from "../config";

const log = logger("watch-html-body");

type Callback = () => void;
export function watchHtmlBody(callback: Callback) {
  log("init", { callback });
  const observerParams = { attributes: true };
  const htmlObserver = new MutationObserver(() => {
    log("html change");
    callback();
  });
  const bodyObserver = new MutationObserver(() => {
    log("body change");
    callback();
  });
  htmlObserver.observe(document.documentElement, observerParams);
  bodyObserver.observe(document.body, observerParams);
}
