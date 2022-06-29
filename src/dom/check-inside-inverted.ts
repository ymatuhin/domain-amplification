import { HTMLElementExtended } from "./handlers";

export function checkInsideInverted(element: HTMLElementExtended): boolean {
  const parent = element.parentElement as HTMLElementExtended;
  if (!parent) return false;
  if (parent.inverted) return true;
  return checkInsideInverted(parent);
}
