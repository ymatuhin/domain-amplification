import { invertedPropName } from "../config";
import { HTMLElementExtended } from "../middleware";

export function checkInsideInverted(element: HTMLElementExtended): boolean {
  const parent = element.parentElement as HTMLElementExtended;
  if (!parent) return false;
  if (parent[invertedPropName]) return true;
  return checkInsideInverted(parent);
}
