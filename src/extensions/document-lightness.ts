import { get } from "svelte/store";
import { MiddlewareParams } from ".";
import { checkDocumentIsLight } from "../color";
import { logger } from "../config";
import { waitForBody } from "../dom";
import { $isLight } from "../state";

const log = logger("ext:document-lightness");

export default async function (params: MiddlewareParams) {
  const { status, isDocument } = params;

  if (status === "init" || status === "start" || isDocument) {
    log("init");
    await waitForBody();
    const isLight = checkDocumentIsLight();
    log("syncLightness", { isLight });
    $isLight.set(isLight);
    return { ...params, isLight };
  }

  return { ...params, isLight: get($isLight) };
}
