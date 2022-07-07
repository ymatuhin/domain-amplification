import type { MiddlewareParams } from ".";
import { $isEnabled, $isLight } from "../state";

export default function (params: MiddlewareParams) {
  params.$isLight = $isLight;
  params.$isEnabled = $isEnabled;
  return params;
}
