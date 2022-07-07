import type { MiddlewareParams } from ".";
import { invertedPropName, rulesPropName } from "../config";

export default function (params: MiddlewareParams) {
  const { element, isDocument } = params;

  if (!element || isDocument) return params;
  if (element[invertedPropName] === undefined) return params;

  // clean previous state
  element[invertedPropName] = undefined;
  element[rulesPropName] = element[rulesPropName] ?? [];

  return params;
}
