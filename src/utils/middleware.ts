import { isObject } from "shared/is/object";

export const createMiddleware = (order: Function[] = []) => {
  return async function run(params: object = {}, index: number = 0) {
    const fn = order[index];
    if (!fn) return;
    const fnResult = fn(params);
    const result = fnResult?.then ? await fnResult : fnResult;
    if (isObject(result)) run(result, index + 1);
  };
};
