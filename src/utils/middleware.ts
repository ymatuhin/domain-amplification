export const createMiddleware = (order: Function[] = []) => {
  return async function run(params: any, index: number = 0) {
    const fn = order[index];
    if (!fn) return;
    const fnResult = fn(params);
    const result = fnResult?.then ? await fnResult : fnResult;
    run(result, index + 1);
  };
};
