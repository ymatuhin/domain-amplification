import { addRule, removeRule } from "../styles";
import type { Extension } from "./index";

const rule = `:fullscreen { filter: initial !important; }`;

export default {
  start() {
    addRule(rule);
  },
  stop() {
    removeRule(rule);
  },
} as Extension;
