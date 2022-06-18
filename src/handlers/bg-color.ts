import { getLightnessStatus } from "../utils/get-lightness-status";
import { hasBackColor } from "../utils/has-back-color";

export default (item: Node) => {
  if (!(item instanceof HTMLElement)) return;
  const styles = getComputedStyle(item);
  if (!hasBackColor(styles)) return;
  const status = getLightnessStatus(styles);
  if (status) item.dataset.daBgColor = status;
};
