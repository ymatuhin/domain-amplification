import type { MiddlewareParams } from ".";
import { checkDocumentIsLight } from "../color";
import { logger } from "../config";
import { waitForBody } from "../dom";

const log = logger("middleware:is-light");

export default async function (params: MiddlewareParams) {
  const { status, isDocument, $isLight } = params;

  if (status === "init" || isDocument) {
    await waitForBody();
    const isLight = checkDocumentIsLight();
    log(status, isLight);
    $isLight.set(isLight);
  }

  return params;
}
