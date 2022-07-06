import type { MiddlewareParams } from "./index";

export default function (params: MiddlewareParams) {
  const { element } = params;

  params.isDocument =
    element instanceof HTMLHtmlElement || element instanceof HTMLBodyElement;

  return params;
}
