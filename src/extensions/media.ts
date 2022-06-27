import { mediaSelector } from "../config";
import { addRule, mediaFilter, removeRule, resetFilter } from "../styles";
import type { Extension } from "./index";

const mediaSelectorArr = mediaSelector.split(",");
const resetSelector = mediaSelectorArr
  .flatMap((selector1) => {
    return mediaSelectorArr.map((selector2) => `${selector1} ${selector2}`);
  })
  .join(",");

const rule1 = `${mediaSelector} { ${mediaFilter} }`;
const rule2 = `${resetSelector} { ${resetFilter} }`;

export default {
  start() {
    addRule(rule1);
    addRule(rule2);
  },
  stop() {
    removeRule(rule1);
    removeRule(rule2);
  },
} as Extension;
