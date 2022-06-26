import { HTMLElementExtended } from "./handlers";

export function checkInsideInverted(element: HTMLElementExtended): boolean {
  const parent = element.parentElement as HTMLElementExtended;
  if (element.inverted) return true;
  if (!parent) return false;
  if (parent.inverted) return true;
  return checkInsideInverted(parent);
}
