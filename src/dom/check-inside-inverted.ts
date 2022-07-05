import { HTMLElementExtended } from "../extensions";

export function checkInsideInverted(element: HTMLElementExtended): boolean {
  const parent = element.parentElement as HTMLElementExtended;
  if (!parent) return false;
  if (parent.__sdm_inverted) return true;
  return checkInsideInverted(parent);
}
