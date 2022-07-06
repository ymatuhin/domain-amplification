import type { MiddlewareParams } from ".";
import { invertedPropName } from "../config";

export default function (params: MiddlewareParams) {
  const { element, isDocument } = params;

  if (!element || isDocument) return params;
  if (element[invertedPropName] === undefined) return params;

  // clean previous state
  element[invertedPropName] = undefined;

  return params;
}
