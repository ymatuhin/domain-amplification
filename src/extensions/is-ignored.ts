import type { MiddlewareParams } from "./index";

export default function (params: MiddlewareParams) {
  const { element } = params;

  params.isIgnored =
    element instanceof HTMLVideoElement ||
    element instanceof HTMLEmbedElement ||
    element instanceof HTMLObjectElement ||
    element instanceof HTMLIFrameElement;

  return params;
}
