let map: Record<string, number> = {};

const style = document.createElement("style");
style.className = "smart-dark-mode";
document.documentElement.prepend(style);
const sheet = style.sheet as CSSStyleSheet;

export const addRule = (selector: string, rules: string) => {
  if (map[selector]) removeRule(selector);
  const id = sheet.insertRule(
    `${selector} { ${rules} }`,
    sheet.cssRules.length,
  );
  map[selector] = id;
};

export const removeRule = (selector: string) => {
  const id = map[selector];
  if (id) sheet.deleteRule(id);
};

export const clearRules = () => {
  Object.values(map).forEach((id) => sheet.deleteRule(id));
  map = {};
};
