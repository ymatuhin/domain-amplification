import { logger } from "../config";
import { waitForBody } from "./wait-for-body";

const log = logger("watch-html-body");

type Callback = () => void;
export async function watchHtmlBody(callback: Callback) {
  log("init", { callback });
  await waitForBody();
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
