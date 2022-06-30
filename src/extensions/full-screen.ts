import { addRule, makeRule, removeRule } from "../styles";
import type { Extension } from "./index";

const rule = makeRule(`:fullscreen { filter: initial !important; }`);

export default {
  start() {
    addRule(rule);
  },
  stop() {
    removeRule(rule);
  },
} as Extension;
