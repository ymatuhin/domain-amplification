import { MiddlewareParams } from ".";
import { removeRule } from "../styles";

export default function (params: MiddlewareParams) {
  const { element, isDocument } = params;

  if (!element || isDocument) return params;

  // clean previous state
  if (element.__sdm_rule) {
    removeRule(element.__sdm_rule);
    element.__sdm_inverted = undefined;
    element.__sdm_rule = undefined;
  }

  return params;
}
